/*
 * clothMaterial.js — the photoreal cloth material and its procedurally generated normal maps.
 *
 * Three scales of fabric detail combine here: the physics FOLDS (geometry, from clothSim), a
 * low-frequency MESO wrinkle normal, and a high-frequency MICRO weave normal. The meso map is
 * blended over the micro map in a derivative-built tangent frame via onBeforeCompile, which
 * also adds dynamic crease AO (aShade), a neutral grazing rim ("fuzz"), and a weave-tied
 * roughness shimmer. The cloth is fully OPAQUE — the cursor interaction is physical motion,
 * never a see-through reveal. Black stays dominant; gold a whisper.
 */

import * as THREE from 'three';

// Exact brand tokens, hardcoded (decoupled from tailwind.config.js).
const CLOTH_COLOR = '#1D1D22'; // colors.surface — dark matte fabric base (kept; darken via light)
const GOLD = '#C9A227'; // colors.accent — sheen whisper only

// Material — black-dominant; gold a whisper. Darkened via lighting, not a base recolor.
const ROUGHNESS = 0.85; // matte clothing, not satin
const SHEEN = 0.35;
const SHEEN_ROUGHNESS = 0.45;
const ENV_MAP_INTENSITY = 0.2; // mostly neutral-dark environment
const NORMAL_SCALE = 0.22; // micro weave (folds now carry the macro form)

// Grazing-angle fabric rim — subtle, neutral / barely warm (NOT gold).
const RIM_STRENGTH = 0.13;
const RIM_COLOR = '#FFF6E6';

// Cinematic post — applied screen-space in the cloth fragment (no extra pass, no deps).
const VIGNETTE_STRENGTH = 0.35; // dark edge falloff (atmosphere, not a spotlight)
const VIGNETTE_INNER = 0.25; // distance from center where darkening begins
const VIGNETTE_OUTER = 0.78; // distance of full darkening

// Meso wrinkle normal (low frequency, layered under the micro weave).
const WRINKLE_NORMAL_AMP = 0.25;
const MESO_REPEAT_X = 4;
const MESO_REPEAT_Y = 5;

// Weave-tied roughness variation so threads shimmer.
const ROUGH_VAR = 0.07;

// Micro fabric-weave normal map (generated offline — no asset fetch).
const WEAVE_TILE = 256;
const WEAVE_THREADS = 8; // thread crossings per tile (even => seamless)
const WEAVE_RELIEF = 2.0;
const WEAVE_REPEAT_X = 160;
const WEAVE_REPEAT_Y = 200;

// Meso wrinkle map (value-noise normal).
const MESO_TILE = 256;
const MESO_RELIEF = 2.6;
const MESO_LATTICE = 6; // base noise cells per tile (periodic)
const MESO_OCTAVES = 3;

// --- Micro weave height: interlacing warp/weft + slight irregularity + a faint twill diagonal.
function weaveHeight(u, v) {
  const fx = u * WEAVE_THREADS;
  const fy = v * WEAVE_THREADS;
  // Low-frequency, tile-periodic jitter so the weave isn't a mechanical grid.
  const jitter = Math.sin(u * 2 * Math.PI * 2 + 1.3) * Math.sin(v * 2 * Math.PI * 3 + 0.7);
  const warp = Math.sin(Math.PI * (fx - Math.floor(fx))) * (1 + 0.15 * jitter);
  const weft = Math.sin(Math.PI * (fy - Math.floor(fy))) * (1 - 0.15 * jitter);
  const warpOnTop = ((Math.floor(fx) + Math.floor(fy)) & 1) === 0;
  const base = warpOnTop ? warp * 0.75 + weft * 0.25 : weft * 0.75 + warp * 0.25;
  return base + 0.12 * Math.sin((fx - fy) * Math.PI); // faint twill
}

function createWeaveNormalTexture(gl) {
  const size = WEAVE_TILE;
  const data = new Uint8Array(size * size * 4);
  const wrap = (n) => (((n % size) + size) % size) / size;
  const sample = (x, y) => weaveHeight(wrap(x), wrap(y));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const h = sample(x, y);
      const dx = (sample(x + 1, y) - sample(x - 1, y)) * WEAVE_RELIEF;
      const dy = (sample(x, y + 1) - sample(x, y - 1)) * WEAVE_RELIEF;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      data[i] = Math.round(((-dx / len) * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round(((-dy / len) * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round(((1 / len) * 0.5 + 0.5) * 255);
      // Alpha encodes a roughness offset tied to the weave (thread crests slightly smoother).
      data[i + 3] = Math.round(Math.min(1, Math.max(0, 0.7 - 0.5 * h)) * 255);
    }
  }
  return finishTexture(gl, data, size, WEAVE_REPEAT_X, WEAVE_REPEAT_Y);
}

// --- Meso wrinkle height: tile-periodic value-noise fBm.
function hash2(ix, iy, period) {
  const x = ((ix % period) + period) % period;
  const y = ((iy % period) + period) % period;
  let n = (x * 374761393 + y * 668265263) >>> 0;
  n = ((n ^ (n >> 13)) * 1274126177) >>> 0;
  n = (n ^ (n >> 16)) >>> 0;
  return n / 4294967295;
}

function valueNoise(u, v, cells) {
  const x = u * cells;
  const y = v * cells;
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(x0, y0, cells);
  const b = hash2(x0 + 1, y0, cells);
  const c = hash2(x0, y0 + 1, cells);
  const d = hash2(x0 + 1, y0 + 1, cells);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

function mesoHeight(u, v) {
  let h = 0;
  let amp = 1;
  let total = 0;
  let cells = MESO_LATTICE;
  for (let o = 0; o < MESO_OCTAVES; o += 1) {
    h += valueNoise(u, v, cells) * amp;
    total += amp;
    amp *= 0.5;
    cells *= 2;
  }
  return h / total;
}

function createMesoNormalTexture(gl) {
  const size = MESO_TILE;
  const data = new Uint8Array(size * size * 4);
  const wrap = (n) => (((n % size) + size) % size) / size;
  const sample = (x, y) => mesoHeight(wrap(x), wrap(y));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (sample(x + 1, y) - sample(x - 1, y)) * MESO_RELIEF;
      const dy = (sample(x, y + 1) - sample(x, y - 1)) * MESO_RELIEF;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      data[i] = Math.round(((-dx / len) * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round(((-dy / len) * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round(((1 / len) * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  // Repeat handled in-shader via uMesoRepeat, so leave texture repeat at 1.
  return finishTexture(gl, data, size, 1, 1);
}

function finishTexture(gl, data, size, repeatX, repeatY) {
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.colorSpace = THREE.NoColorSpace; // normal/roughness data is linear, not sRGB color
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = gl.capabilities.getMaxAnisotropy();
  tex.needsUpdate = true;
  return tex;
}

// Build the patched MeshPhysicalMaterial. Disposables are stashed on userData.
export function createClothMaterial(gl) {
  const microMap = createWeaveNormalTexture(gl);
  const mesoMap = createMesoNormalTexture(gl);

  const material = new THREE.MeshPhysicalMaterial({
    color: CLOTH_COLOR,
    roughness: ROUGHNESS,
    metalness: 0,
    sheen: SHEEN,
    sheenRoughness: SHEEN_ROUGHNESS,
    sheenColor: new THREE.Color(GOLD),
    envMapIntensity: ENV_MAP_INTENSITY,
    normalMap: microMap,
    side: THREE.DoubleSide,
  });
  material.normalScale.set(NORMAL_SCALE, NORMAL_SCALE);
  material.userData.mesoNormalMap = mesoMap;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.mesoNormalMap = { value: mesoMap };
    shader.uniforms.uMesoRepeat = { value: new THREE.Vector2(MESO_REPEAT_X, MESO_REPEAT_Y) };
    shader.uniforms.uMesoAmp = { value: WRINKLE_NORMAL_AMP };
    shader.uniforms.uRimStrength = { value: RIM_STRENGTH };
    shader.uniforms.uRimColor = { value: new THREE.Color(RIM_COLOR) };
    shader.uniforms.uRoughVar = { value: ROUGH_VAR };
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uResolution = { value: new THREE.Vector2(1, 1) };
    material.userData.shader = shader; // lets CurtainCloth drive uTime / uResolution

    // Per-vertex shade (crease AO * albedo variation) + cloth UV for the meso lookup.
    shader.vertexShader =
      'attribute float aShade;\nvarying float vShade;\nvarying vec2 vClothUv;\n' +
      shader.vertexShader.replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n\tvShade = aShade;\n\tvClothUv = uv;',
      );

    shader.fragmentShader =
      'uniform sampler2D mesoNormalMap;\nuniform vec2 uMesoRepeat;\nuniform float uMesoAmp;\nuniform float uRimStrength;\nuniform vec3 uRimColor;\nuniform float uRoughVar;\nuniform float uTime;\nuniform vec2 uResolution;\nvarying float vShade;\nvarying vec2 vClothUv;\n' +
      shader.fragmentShader
        // Weave-tied roughness shimmer (alpha of the micro map).
        .replace(
          '#include <roughnessmap_fragment>',
          '#include <roughnessmap_fragment>\n\troughnessFactor += ( texture2D( normalMap, vNormalMapUv ).a - 0.5 ) * 2.0 * uRoughVar;\n\troughnessFactor = clamp( roughnessFactor, 0.04, 1.0 );',
        )
        // Blend the meso wrinkle normal in a derivative-built tangent frame; compute the rim.
        .replace(
          '#include <normal_fragment_maps>',
          [
            '#include <normal_fragment_maps>',
            '\t{',
            '\t\tvec3 mesoN = texture2D( mesoNormalMap, vClothUv * uMesoRepeat ).xyz * 2.0 - 1.0;',
            '\t\tvec3 vp = - vViewPosition;',
            '\t\tvec3 q0 = dFdx( vp ); vec3 q1 = dFdy( vp );',
            '\t\tvec2 s0 = dFdx( vClothUv ); vec2 s1 = dFdy( vClothUv );',
            '\t\tvec3 Td = q0 * s1.y - q1 * s0.y;',
            '\t\tTd = normalize( Td - normal * dot( normal, Td ) );',
            '\t\tvec3 Bd = normalize( cross( normal, Td ) );',
            '\t\tnormal = normalize( normal + ( Td * mesoN.x + Bd * mesoN.y ) * uMesoAmp );',
            '\t}',
            '\tfloat clothRim = pow( 1.0 - clamp( dot( normal, normalize( vViewPosition ) ), 0.0, 1.0 ), 3.0 );',
          ].join('\n'),
        )
        // Crease AO (+ albedo var) on all light, then the neutral fabric rim. Alpha stays 1.
        .replace(
          '#include <opaque_fragment>',
          '#include <opaque_fragment>\n\tgl_FragColor.rgb *= vShade;\n\tgl_FragColor.rgb += clothRim * uRimStrength * uRimColor;',
        )
        // Cinematic post in display space: a gentle vignette + fine animated film grain.
        .replace(
          '#include <colorspace_fragment>',
          [
            '#include <colorspace_fragment>',
            '\tvec2 clothScreenUv = gl_FragCoord.xy / uResolution;',
            `\tgl_FragColor.rgb *= 1.0 - ${VIGNETTE_STRENGTH.toFixed(3)} * smoothstep( ${VIGNETTE_INNER.toFixed(3)}, ${VIGNETTE_OUTER.toFixed(3)}, distance( clothScreenUv, vec2( 0.5 ) ) );`,
          ].join('\n'),
        );
  };

  return material;
}

export function disposeClothMaterial(material) {
  if (material.normalMap) material.normalMap.dispose();
  if (material.userData.mesoNormalMap) material.userData.mesoNormalMap.dispose();
  material.dispose();
}
