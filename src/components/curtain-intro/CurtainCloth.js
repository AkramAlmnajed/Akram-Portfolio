import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { ClothSim, FILL_W, FILL_H, FIXED_DT, WIND_RADIUS } from './clothSim';
import { createClothMaterial, createCheapClothMaterial, disposeClothMaterial } from './clothMaterial';

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

// Touch gust tuning (MOBILE). The gust MODEL is identical to mouse; a fingertip is just larger
// and less precise than a cursor, and touch-move events arrive jittery/coalesced.
const WIND_RADIUS_TOUCH = 3.0; // wider reach than the mouse WIND_RADIUS (2.0) for a finger
const TOUCH_VEL_SMOOTH = 0.4; // low-pass on the pointer velocity (0..1; lower = smoother)
const TOUCH_VEL_MAX = 60; // clamp |velocity| (world u/s) so a fast flick can't over-drive the sim

// Fixed-timestep driver guards (Lesson 7: a tab refocus must not explode the sim).
const MAX_SUBSTEPS = 3; // cap catch-up steps so a slow frame can't spiral into more sim work
const MAX_FRAME = 0.1; // clamp huge deltas
const MIN_DT = 1 / 120; // floor for pointer-velocity division

// Adaptive quality governor: scales DOWN only when a device genuinely can't hold a reasonable
// frame rate, using cheap geometry-STABLE knobs (never rebuilds the mesh). Budgets are FPS-based
// (refresh-INDEPENDENT) so it's inherently ProMotion-safe — a 120Hz device comfortably holding
// 60fps is never treated as over budget. Step order: DPR -> iterations -> (last resort, only if
// STILL ~<33fps) 30Hz physics.
const SCALER_EMA_ALPHA = 0.06; // frame-time smoothing (~16-frame window)
const SCALER_STEP_MS = 21; // sustained avg above this (~47fps) => step DPR, then iterations
const SCALER_HALFRATE_MS = 30; // 30Hz physics fires ONLY if STILL above this after DPR+iters (~33fps)
const SCALER_SUSTAIN_FRAMES = 60; // must stay over budget this long before stepping down
const SCALER_COOLDOWN_FRAMES = 60; // settle after a step before measuring again
const SCALER_WARMUP_FRAMES = 90; // ignore the noisy first ~1.5s (shader compile / GPU uploads)
const SCALER_MIN_ITERS = 3; // solver-iteration floor
const EXPOSE_GOVERNOR = true; // publish live governor state to window.__tier (no UI/log; removable)

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
//
// `config` (from deviceTier) tunes this per device. On the LOW_END tier `config.live` is
// false: the cloth is settled once at construction, baked ONCE, and never simulated per frame
// (the wipe-up is a CSS canvas lift in CurtainFabric). On MOBILE the sim runs with a smaller
// grid / fewer iterations and a TOUCH wind-gust (finger drag); DESKTOP is the full mouse rig.
export default function CurtainCloth({ onReady, opening, config }) {
  const { viewport, gl, invalidate, setDpr } = useThree();
  const { gridW, gridH, iters, live, pointerWind, post, cheapMaterial } = config;

  const readyRef = useRef(false);
  const accRef = useRef(0);
  const openStartRef = useRef(null);
  // Adaptive governor state: current physics step (raised to 2*FIXED_DT only as a last resort),
  // a rolling frame-time EMA, and the over-budget / cooldown counters.
  const quality = useRef({
    stepDt: FIXED_DT,
    overBudget: 0,
    cooldown: SCALER_WARMUP_FRAMES,
    minFrameMs: 999, // fastest frame seen ~ native refresh (for the ProMotion readout)
    steppedDpr: false,
    steppedIters: false,
    flush: 0,
  });
  const emaRef = useRef(0);
  const reducedMotion = useMemo(
    () => Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    [],
  );

  const material = useMemo(
    () => (cheapMaterial ? createCheapClothMaterial() : createClothMaterial(gl, { post })),
    [gl, post, cheapMaterial],
  );

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
      active: false, // mouse: hovering; touch: a pointer is down (gust runs only while down)
      touch: false, // last pointer was a finger → use the wider radius + velocity smoothing
      vx: 0, // low-passed pointer velocity (touch jitter tamer)
      vy: 0,
    }),
    [],
  );

  // Oversized plane; position driven by the sim. aShade = crease AO * albedo variation.
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(
      viewport.width * FILL_W,
      viewport.height * FILL_H,
      gridW - 1,
      gridH - 1,
    );
    const count = gridW * gridH;
    g.setAttribute('aShade', new THREE.BufferAttribute(new Float32Array(count).fill(1), 1));
    const albedo = new Float32Array(count);
    for (let j = 0; j < gridH; j += 1) {
      for (let i = 0; i < gridW; i += 1) albedo[j * gridW + i] = albedoAt(i, j);
    }
    g.userData.albedo = albedo;
    return g;
  }, [viewport.width, viewport.height, gridW, gridH]);

  // Built from the flat geometry and settled to a draped pose at construction.
  const sim = useMemo(
    () => new ClothSim(geometry.attributes.position.array, gridW, gridH, iters),
    [geometry, gridW, gridH, iters],
  );

  useEffect(() => () => disposeClothMaterial(material), [material]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  // Recompute vertex normals + per-vertex crease AO from the current fold positions and flag
  // the GPU upload. Runs every frame on live tiers; exactly once on the static LOW_END tier.
  const bake = useCallback(() => {
    const posArr = geometry.attributes.position.array;
    geometry.attributes.position.needsUpdate = true;
    // The cheap LOW_END material is unlit (normals unused) → skip the per-frame normal recompute.
    if (!cheapMaterial) {
      geometry.computeVertexNormals();
      geometry.attributes.normal.needsUpdate = true;
    }

    // Per-vertex crease AO from fold concavity (valley = local Z minimum vs neighbours) * albedo.
    const shadeAttr = geometry.attributes.aShade;
    const shade = shadeAttr.array;
    const albedo = geometry.userData.albedo;
    for (let j = 0; j < gridH; j += 1) {
      for (let i = 0; i < gridW; i += 1) {
        const p = j * gridW + i;
        const z = posArr[p * 3 + 2];
        let sum = 0;
        let n = 0;
        if (i > 0) { sum += posArr[(p - 1) * 3 + 2]; n += 1; }
        if (i < gridW - 1) { sum += posArr[(p + 1) * 3 + 2]; n += 1; }
        if (j > 0) { sum += posArr[(p - gridW) * 3 + 2]; n += 1; }
        if (j < gridH - 1) { sum += posArr[(p + gridW) * 3 + 2]; n += 1; }
        const concavity = n > 0 ? sum / n - z : 0;
        let t = concavity / AO_RANGE;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        shade[p] = (1 - AO_STRENGTH * t) * albedo[p];
      }
    }
    shadeAttr.needsUpdate = true;
  }, [geometry, gridW, gridH, cheapMaterial]);

  // Track the pointer on tiers that use the gust (DESKTOP + MOBILE; LOW_END has pointerWind
  // false). ONE Pointer Events path covers mouse + touch + pen. We write ONLY the latest
  // position here — no raycast / setWind per event — so coalesced touch-move bursts can't
  // thrash the sim; the raycast → world-velocity → setWind runs ONCE per frame in useFrame,
  // consistent with the fixed timestep. The canvas rect is cached and refreshed only on resize
  // (reading getBoundingClientRect per move forces a full-page synchronous layout).
  //
  // Mouse (desktop): hover drives the gust continuously, no button — byte-for-byte as before.
  // Touch/pen: the gust is active only while a pointer is DOWN; pointerdown seeds the tracker so
  // the first move computes no phantom velocity (no initial kick), and pointerup/cancel/leave
  // lets it decay back to rest. (StrictMode-safe.)
  useEffect(() => {
    if (!pointerWind) return undefined;
    const el = gl.domElement;
    let rect = el.getBoundingClientRect();
    const refreshRect = () => {
      rect = el.getBoundingClientRect();
    };
    const setNdc = (e) => {
      wind.ndc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
    };
    const onMove = (e) => {
      setNdc(e);
      wind.touch = e.pointerType === 'touch';
      wind.active = true;
    };
    const onDown = (e) => {
      if (e.pointerType === 'mouse') return; // desktop hover path is untouched
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* capture unsupported / pointer already gone — harmless */
      }
      rect = el.getBoundingClientRect();
      setNdc(e);
      wind.hasPrev = false; // seed: next frame sets prev → zero phantom velocity → no kick
      wind.touch = e.pointerType === 'touch';
      wind.active = true;
    };
    const onUp = (e) => {
      if (e.pointerType === 'mouse') return; // desktop never "releases" the hover gust
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* already released — harmless */
      }
      wind.active = false; // target → 0; the gust decays over a few frames (GUST_DECAY)
    };
    el.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener('pointerleave', onUp, { passive: true });
    window.addEventListener('resize', refreshRect, { passive: true });
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointerleave', onUp);
      window.removeEventListener('resize', refreshRect);
    };
  }, [gl, wind, pointerWind]);

  // STATIC tier (LOW_END): the sim already settled to a draped pose at construction. Bake the
  // shading ONCE, render a single on-demand frame, and reveal — then no physics ever runs.
  useEffect(() => {
    if (live) return undefined;
    bake();
    invalidate(); // demand frameloop: draw the static drape now
    if (!readyRef.current) {
      readyRef.current = true;
      if (onReady) onReady();
    }
    return undefined;
  }, [live, bake, invalidate, onReady]);

  useFrame((state, delta) => {
    if (document.hidden) return;
    if (!live) return; // static drape — no per-frame sim; CSS handles the wipe-up

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
    } else if (pointerWind && (wind.active || wind.gust > 1e-4)) {
      // Pointer -> cloth space: raycast the rest plane so the gust lands exactly under the
      // cursor/finger. GATED: this runs ONLY while a pointer is down (or the gust is still
      // decaying after release) — never every idle frame. Consumes the latest position the
      // pointer handlers wrote (decoupled).
      const velDt = frameDt < MIN_DT ? MIN_DT : frameDt;
      wind.ray.setFromCamera(wind.ndc, state.camera);
      let dirX = 0;
      let dirY = 0;
      let speed = 0;
      if (wind.ray.ray.intersectPlane(wind.plane, wind.world)) {
        if (wind.hasPrev) {
          let vx = (wind.world.x - wind.prev.x) / velDt;
          let vy = (wind.world.y - wind.prev.y) / velDt;
          if (wind.touch) {
            // Touch ONLY: low-pass the velocity (coalesced-event jitter) and clamp its magnitude
            // so a fast flick can't over-drive the lower mobile iteration count. Mouse skips this
            // entirely → the desktop velocity math is byte-for-byte unchanged.
            wind.vx += (vx - wind.vx) * TOUCH_VEL_SMOOTH;
            wind.vy += (vy - wind.vy) * TOUCH_VEL_SMOOTH;
            vx = wind.vx;
            vy = wind.vy;
            const mag = Math.hypot(vx, vy);
            if (mag > TOUCH_VEL_MAX) {
              const k = TOUCH_VEL_MAX / mag;
              vx *= k;
              vy *= k;
            }
          }
          speed = Math.hypot(vx, vy);
          if (speed > 1e-4) {
            dirX = vx / speed;
            dirY = vy / speed;
          }
        }
        wind.prev.set(wind.world.x, wind.world.y);
        wind.hasPrev = true;
      }

      // Smooth the gust: fast attack, slow decay. `active` = mouse hovering OR a touch pointer
      // down; when inactive (finger lifted) target is 0 so the gust eases cleanly to rest.
      const target = wind.active ? Math.min(speed * POINTER_SPEED_SCALE, GUST_MAX) : 0;
      wind.gust += (target - wind.gust) * (target > wind.gust ? GUST_ATTACK : GUST_DECAY);
      sim.windRadius = wind.touch ? WIND_RADIUS_TOUCH : WIND_RADIUS; // finger gets a wider reach
      sim.setWind(wind.world.x, wind.world.y, wind.gust, dirX, dirY);
    } else {
      // Idle: no pointer is down and the gust has settled (or a non-pointer tier) → NO raycast,
      // NO velocity work this frame. Just clear the gust; the sim's idle breeze still animates it.
      sim.setWind(0, 0, 0, 0, 0);
    }

    // Fixed-timestep accumulator with clamped substeps. The step is FIXED_DT normally; the
    // adaptive governor may raise it to 2*FIXED_DT (30Hz) as a last resort on weak hardware.
    const stepDt = quality.current.stepDt;
    accRef.current += frameDt;
    let steps = 0;
    while (accRef.current >= stepDt && steps < MAX_SUBSTEPS) {
      sim.step(stepDt);
      accRef.current -= stepDt;
      steps += 1;
    }
    if (steps === MAX_SUBSTEPS) accRef.current = 0; // drop backlog after a long stall

    // Positions only change when a step ran → re-bake only then. Visually identical (geometry is
    // unchanged on no-step frames) and it halves the normal/AO recompute at the 30Hz scaler level.
    if (steps > 0) bake();

    // Adaptive quality governor — scale DOWN only, and never while a tier is holding target. The
    // budgets are FPS-based, so a 120Hz device holding 60fps stays inert (no ProMotion penalty).
    // Knobs in order: DPR -> iterations -> (only if STILL ~<33fps) 30Hz physics. No step-up.
    if (!opening) {
      const q = quality.current;
      const dtMs = frameDt * 1000;
      if (dtMs > 1 && dtMs < q.minFrameMs) q.minFrameMs = dtMs; // fastest frame ~ native refresh
      emaRef.current =
        emaRef.current === 0 ? frameDt : emaRef.current + (frameDt - emaRef.current) * SCALER_EMA_ALPHA;
      const avgMs = emaRef.current * 1000;

      if (q.cooldown > 0) {
        q.cooldown -= 1;
      } else if (avgMs > SCALER_STEP_MS) {
        q.overBudget += 1;
        if (q.overBudget >= SCALER_SUSTAIN_FRAMES) {
          if (gl.getPixelRatio() > 1.001) {
            setDpr(1); // 1) cut fill rate first (biggest win); a no-op on DPR-1 tiers
            q.steppedDpr = true;
          } else if (sim.iters > SCALER_MIN_ITERS) {
            sim.iters = SCALER_MIN_ITERS; // 2) drop solver iterations to the floor
            q.steppedIters = true;
          } else if (q.stepDt < FIXED_DT * 1.5 && avgMs > SCALER_HALFRATE_MS) {
            q.stepDt = FIXED_DT * 2; // 3) LAST RESORT, only if STILL ~<33fps: 30Hz physics
          }
          q.overBudget = 0;
          q.cooldown = SCALER_COOLDOWN_FRAMES;
        }
      } else {
        q.overBudget = 0; // back under budget → reset (hysteresis; no step-up this pass)
      }

      // Publish live governor state to window.__tier for remote-DevTools verification (~2-4Hz, no
      // UI / no console) — lets us confirm an Apple high-end device is NOT being stepped + that the
      // DPR cap actually clamped on iOS Safari (drawBuffer vs css).
      q.flush += 1;
      if (EXPOSE_GOVERNOR && q.flush >= 30) {
        q.flush = 0;
        const el = gl.domElement;
        window.__tier = {
          ...(typeof window !== 'undefined' && window.__tier ? window.__tier : {}),
          refreshHz: q.minFrameMs < 999 ? Math.round(1000 / q.minFrameMs) : 0,
          avgFrameMs: Math.round(avgMs),
          physicsHz: q.stepDt > FIXED_DT * 1.5 ? 30 : 60,
          steppedDPR: q.steppedDpr,
          steppedIters: q.steppedIters,
          dpr: Math.round(gl.getPixelRatio() * 100) / 100,
          drawBuffer: [el.width, el.height],
          css: [Math.round(el.clientWidth), Math.round(el.clientHeight)],
        };
      }
    }

    // Drive the cinematic post: keep the resolution current; grain animates (frozen if reduced-motion).
    const shader = material.userData.shader;
    if (shader && post) {
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
