import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { ClothSim, GRID_W, GRID_H, FILL_W, FILL_H, FIXED_DT } from './clothSim';
import { createClothMaterial, disposeClothMaterial } from './clothMaterial';

const GOLD = '#C9A227'; // colors.accent — rim/sheen whisper only

// Lighting rig — darkened via light (not a base recolor) to kill any olive/brown cast.
const KEY_INTENSITY = 1.6; // neutral white key
const RIM_INTENSITY = 0.2; // dim gold rim, grazing
const GOLD_LIGHTFORMER = 0.2; // small/dim gold environment glint

// Crease ambient occlusion (darken fold valleys) + low-frequency albedo grime.
const AO_STRENGTH = 0.78; // deep valley darkening (near-black crease cores); crests untouched
const AO_RANGE = 0.1; // concavity (world units) that maps to full AO
const ALBEDO_VAR = 0.05; // +/- large-scale luminance variation (grime) so no two regions match

// Pointer gust feel — strongly speed-scaled (slow = gentle sway, fast = forceful shove).
const POINTER_SPEED_SCALE = 0.03; // pointer speed -> gust intensity
const GUST_MAX = 1.8; // intensity ceiling (raised so fast sweeps really shove)
const GUST_ATTACK = 0.4; // gust rises quickly...
const GUST_DECAY = 0.06; // ...and eases back to rest when the pointer stops/leaves

// Fixed-timestep driver guards (Lesson 7: a tab refocus must not explode the sim).
const MAX_SUBSTEPS = 5;
const MAX_FRAME = 0.1; // clamp huge deltas
const MIN_DT = 1 / 120; // floor for pointer-velocity division

// Open lift — the pins fly up off-screen and the folded body follows (physical fabric wipe).
const LIFT_DURATION = 1.0; // seconds for the cloth to clear the viewport
const LIFT_VIEWPORT_FACTOR = 2.5; // pins lift this many viewport-heights
const LIFT_EASE_POW = 1.6; // ease-in (accelerating yank)

// Static large-scale albedo grime per particle (low frequency => big blotches, not a pattern).
function albedoAt(i, j) {
  const n = Math.sin(i * 0.12 + j * 0.09 + 0.5) * 0.6 + Math.sin(i * 0.07 - j * 0.15 + 1.7) * 0.4;
  return 1 + ALBEDO_VAR * n;
}

// Real Verlet-simulated cloth: three scales of detail, crease AO, grazing rim, organic idle
// wind, and a cursor gust that physically shoves the OPAQUE fabric (no see-through).
export default function CurtainCloth({ onReady, opening }) {
  const { viewport, gl } = useThree();
  const readyRef = useRef(false);
  const accRef = useRef(0);
  const openStartRef = useRef(null);
  const reducedMotion = useMemo(
    () => Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    [],
  );

  const material = useMemo(() => createClothMaterial(gl), [gl]);

  // Pointer/gust scratch state (refs only — never React state, never re-renders on move).
  const wind = useMemo(
    () => ({
      ndc: new THREE.Vector2(),
      ray: new THREE.Raycaster(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), // the cloth's rest plane (z = 0)
      world: new THREE.Vector3(),
      prev: new THREE.Vector2(),
      hasPrev: false,
      gust: 0,
    }),
    [],
  );

  // Oversized plane; position driven by the sim. aShade = crease AO * albedo variation.
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(
      viewport.width * FILL_W,
      viewport.height * FILL_H,
      GRID_W - 1,
      GRID_H - 1,
    );
    const count = GRID_W * GRID_H;
    g.setAttribute('aShade', new THREE.BufferAttribute(new Float32Array(count).fill(1), 1));
    const albedo = new Float32Array(count);
    for (let j = 0; j < GRID_H; j += 1) {
      for (let i = 0; i < GRID_W; i += 1) albedo[j * GRID_W + i] = albedoAt(i, j);
    }
    g.userData.albedo = albedo;
    return g;
  }, [viewport.width, viewport.height]);

  // Built from the flat geometry and settled to a draped pose at construction.
  const sim = useMemo(
    () => new ClothSim(geometry.attributes.position.array, GRID_W, GRID_H),
    [geometry],
  );

  useEffect(() => () => disposeClothMaterial(material), [material]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Track the pointer in NDC (StrictMode-safe: the cleanup removes the single listener).
  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      wind.ndc.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [gl, wind]);

  useFrame((state, delta) => {
    if (document.hidden) return;

    const frameDt = delta > MAX_FRAME ? MAX_FRAME : delta;

    if (opening) {
      // Fly the curtain up: lift the pins off-screen (ease-in), no pointer wind.
      if (openStartRef.current === null) {
        openStartRef.current = state.clock.elapsedTime;
        sim.setOpening(true);
      }
      const progress = Math.min((state.clock.elapsedTime - openStartRef.current) / LIFT_DURATION, 1);
      sim.liftPins(viewport.height * LIFT_VIEWPORT_FACTOR * Math.pow(progress, LIFT_EASE_POW));
      sim.setWind(0, 0, 0, 0, 0);
    } else {
      // Pointer -> cloth space: raycast the rest plane so the gust lands exactly under the cursor.
      const velDt = frameDt < MIN_DT ? MIN_DT : frameDt;
      wind.ray.setFromCamera(wind.ndc, state.camera);
      let dirX = 0;
      let dirY = 0;
      let speed = 0;
      if (wind.ray.ray.intersectPlane(wind.plane, wind.world)) {
        if (wind.hasPrev) {
          const vx = (wind.world.x - wind.prev.x) / velDt;
          const vy = (wind.world.y - wind.prev.y) / velDt;
          speed = Math.hypot(vx, vy);
          if (speed > 1e-4) {
            dirX = vx / speed;
            dirY = vy / speed;
          }
        }
        wind.prev.set(wind.world.x, wind.world.y);
        wind.hasPrev = true;
      }

      // Smooth the gust: fast attack, slow decay (eases back to rest with inertia).
      const target = Math.min(speed * POINTER_SPEED_SCALE, GUST_MAX);
      wind.gust += (target - wind.gust) * (target > wind.gust ? GUST_ATTACK : GUST_DECAY);
      sim.setWind(wind.world.x, wind.world.y, wind.gust, dirX, dirY);
    }

    // Fixed-timestep accumulator with clamped substeps.
    accRef.current += frameDt;
    let steps = 0;
    while (accRef.current >= FIXED_DT && steps < MAX_SUBSTEPS) {
      sim.step(FIXED_DT);
      accRef.current -= FIXED_DT;
      steps += 1;
    }
    if (steps === MAX_SUBSTEPS) accRef.current = 0; // drop backlog after a long stall

    // Push positions to the GPU and relight the real folds every frame.
    const posArr = geometry.attributes.position.array;
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.attributes.normal.needsUpdate = true;

    // Per-vertex crease AO from fold concavity (valley = local Z minimum vs neighbours) * albedo.
    const shadeAttr = geometry.attributes.aShade;
    const shade = shadeAttr.array;
    const albedo = geometry.userData.albedo;
    for (let j = 0; j < GRID_H; j += 1) {
      for (let i = 0; i < GRID_W; i += 1) {
        const p = j * GRID_W + i;
        const z = posArr[p * 3 + 2];
        let sum = 0;
        let n = 0;
        if (i > 0) { sum += posArr[(p - 1) * 3 + 2]; n += 1; }
        if (i < GRID_W - 1) { sum += posArr[(p + 1) * 3 + 2]; n += 1; }
        if (j > 0) { sum += posArr[(p - GRID_W) * 3 + 2]; n += 1; }
        if (j < GRID_H - 1) { sum += posArr[(p + GRID_W) * 3 + 2]; n += 1; }
        const concavity = n > 0 ? sum / n - z : 0;
        let t = concavity / AO_RANGE;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        shade[p] = (1 - AO_STRENGTH * t) * albedo[p];
      }
    }
    shadeAttr.needsUpdate = true;

    // Drive the cinematic post: keep the resolution current; grain animates (frozen if reduced-motion).
    const shader = material.userData.shader;
    if (shader) {
      shader.uniforms.uResolution.value.set(gl.domElement.width, gl.domElement.height);
      if (!reducedMotion) shader.uniforms.uTime.value = state.clock.elapsedTime % 100;
    }

    if (!readyRef.current) {
      readyRef.current = true;
      if (onReady) onReady();
    }
  });

  return (
    <>
      <directionalLight color="#ffffff" intensity={KEY_INTENSITY} position={[-3, 4, 5]} />
      <directionalLight color={GOLD} intensity={RIM_INTENSITY} position={[5, -2, 1]} />
      <Environment resolution={256} frames={1}>
        <Lightformer color="#ffffff" intensity={1.1} position={[0, 2.5, 3]} scale={[7, 4, 1]} />
        <Lightformer
          color={GOLD}
          intensity={GOLD_LIGHTFORMER}
          position={[2.5, -1.5, 2]}
          scale={[2, 2, 1]}
        />
      </Environment>

      <mesh geometry={geometry} material={material} />
    </>
  );
}
