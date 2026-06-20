/*
 * deviceTier.js — capability-based performance tiers for the curtain intro.
 *
 * The Verlet cloth sim + per-frame normal/AO recompute is smooth on desktop and
 * iPhone but lags badly on weak / old Android phones. We pick ONE tier at mount
 * from cheap capability heuristics and feed a config object to the rest of the
 * curtain:
 *
 *   DESKTOP — full:   live sim, highest grid, pointer-wind gust, cinematic post.
 *   MOBILE  — mid:    live sim but lighter grid/iters, NO pointer wind (idle
 *                     drape only), DPR capped <= 1.75.
 *   LOW_END — weak:   a LIVE but REDUCED-quality interactive cloth — lower grid,
 *                     fewer iterations, an UNLIT (MeshBasic) material, DPR 1, touch
 *                     gust ON. The pre-baked static drape is now reserved for
 *                     no-WebGL / context-loss / reduced-motion ONLY; an adaptive
 *                     runtime scaler holds the frame rate on weak hardware.
 *
 * Why iPhones stay smooth: iOS Safari exposes neither navigator.deviceMemory
 * (so `weakMemory` is always false there) nor a misleadingly-low core count for
 * modern iPhones, so capable iPhones fall through to MOBILE (live sim) — matching
 * the "iPhone is smooth" report. Old low-RAM Androids report deviceMemory <= 4
 * and land in LOW_END.
 */

import { GRID_W, GRID_H, STIFFNESS_ITERS } from './clothSim';

export const TIER = {
  DESKTOP: 'desktop',
  APPLE: 'apple', // Apple touch (iPhone/iPad): desktop-grade visuals + the touch gust
  MOBILE: 'mobile',
  LOW_END: 'low-end',
};

// ── Tier thresholds (named constants — tune here) ──────────────────────────────
export const LOW_END_MAX_CORES = 4; // navigator.hardwareConcurrency <= this => weak CPU
export const LOW_END_MAX_MEMORY_GB = 4; // navigator.deviceMemory <= this => weak device (Android-only signal; iOS omits it)
export const SMALL_VIEWPORT_PX = 768; // min(innerWidth, innerHeight) <= this => phone-class screen

// ── GPU heuristic ──────────────────────────────────────────────────────────────
// Some phones report plenty of CPU cores / RAM but ship a weak GPU that can't hold
// frame rate for the live cloth (the Verlet sim is CPU-light; the per-frame normal/
// AO bake + fill rate are the cost). Read the unmasked GPU renderer string ONCE and
// route known-weak families to LOW_END (static drape). Fail-safe: an unavailable /
// masked string (Firefox/Safari privacy, or no extension) returns null and the
// CPU/RAM/pointer tiering decides — never a false downgrade.
let _gpuRenderer; // undefined = not probed yet; null = unavailable/masked
function gpuRenderer() {
  if (_gpuRenderer !== undefined) return _gpuRenderer;
  _gpuRenderer = null;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        const r = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
        if (typeof r === 'string' && r) _gpuRenderer = r;
      }
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext(); // free the throwaway probe context
    }
  } catch {
    _gpuRenderer = null;
  }
  return _gpuRenderer;
}

// True only for GPU families that reliably can't sustain the live sim on a phone.
// Conservative by design: an unrecognized string is NOT weak (CPU/RAM tiering wins).
export function isWeakGpu(renderer) {
  if (!renderer) return false;
  const r = renderer.toLowerCase();
  if (r.includes('apple')) return false; // iPhone/iPad GPUs are strong — keep them MOBILE
  if (r.includes('powervr')) return true; // SGX/Rogue ship in low-end Androids
  if (/mali-t\d/.test(r)) return true; // Midgard (older Mali-T###)
  if (/mali-4\d{2}/.test(r)) return true; // Utgard (Mali-4##)
  if (/mali-g3\d\b/.test(r)) return true; // entry Bifrost (G31 / G3x)
  const adreno = r.match(/adreno[^\d]*(\d{3,4})/); // 3xx/4xx/5xx weak; 6xx+ ok
  if (adreno) return parseInt(adreno[1], 10) < 600;
  return false;
}

// Exposed for CurtainFabric's window.__tier debug readout. Cached; may be null when the
// renderer string is masked/unavailable.
export function getGpuRenderer() {
  return gpuRenderer();
}

// Apple TOUCH devices (iPhone/iPad) get the desktop-grade cloth (product decision). Detect via the
// unmasked GPU string ('apple') AND a touch capability (maxTouchPoints > 1) so MACS — which use the
// mouse path and are already DESKTOP — are excluded (a trackpad is not a touchscreen). Fallback to
// platform / userAgent when the GPU string is masked (also catches iPadOS 13+, which reports as
// 'MacIntel' but is touch-capable).
export function isAppleTouch() {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator || {};
  const touch = (nav.maxTouchPoints || 0) > 1;
  if (!touch) return false; // Macs / desktops fall through to the DESKTOP (mouse) path
  const r = (gpuRenderer() || '').toLowerCase();
  if (r.includes('apple')) return true;
  const plat = (nav.platform || '').toLowerCase();
  const ua = (nav.userAgent || '').toLowerCase();
  if (/iphone|ipad|ipod/.test(plat) || /iphone|ipad|ipod/.test(ua)) return true;
  if (plat.includes('mac')) return true; // iPadOS-as-Mac (already gated by the touch check above)
  return false;
}

// Pick the tier once, at mount, from combined capability heuristics.
export function detectTier() {
  if (typeof window === 'undefined') return TIER.DESKTOP;

  const nav = window.navigator || {};
  const mq = (q) => Boolean(window.matchMedia && window.matchMedia(q).matches);

  const coarse = mq('(pointer: coarse)');
  const smallViewport =
    Math.min(window.innerWidth || Infinity, window.innerHeight || Infinity) <= SMALL_VIEWPORT_PX;

  const cores = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : null;
  const memory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null;

  const weakCpu = cores !== null && cores <= LOW_END_MAX_CORES;
  const weakMemory = memory !== null && memory <= LOW_END_MAX_MEMORY_GB; // false when unexposed (iOS)

  // A real mouse on a roomy screen => full desktop.
  if (!coarse && !smallViewport) return TIER.DESKTOP;

  // Apple touch (iPhone/iPad): desktop-grade cloth + touch gust (product decision). The runtime
  // governor remains the floor so an older / weaker Apple device still can't fall over.
  if (isAppleTouch()) return TIER.APPLE;

  // Touch / phone-class device. Low-end when RAM is low (the reliable Android
  // signal) OR cores are few on a small screen; otherwise a mid-tier phone.
  if (weakMemory || (weakCpu && smallViewport)) return TIER.LOW_END;

  // Weak-GPU phones (Adreno <600 / Mali-T / Mali-G3x / PowerVR) can pass the CPU/RAM
  // checks yet still can't hold frame rate — route them to the reduced LOW_END cloth.
  if (isWeakGpu(gpuRenderer())) return TIER.LOW_END;

  return TIER.MOBILE;
}

// Per-tier render/sim config consumed by CurtainFabric (Canvas) and CurtainCloth.
export const TIER_CONFIG = {
  [TIER.DESKTOP]: {
    dpr: [1, 1.5],
    gridW: GRID_W, // 44
    gridH: GRID_H, // 62
    iters: STIFFNESS_ITERS, // 10
    live: true, // run the Verlet sim every frame
    pointerWind: true, // cursor gust
    post: true, // grain / vignette post
    antialias: true, // MSAA — desktop GPUs absorb it
  },
  [TIER.APPLE]: {
    // Apple touch = DESKTOP-grade visuals; pointerWind drives the touch-gust lifecycle (Part B).
    dpr: [1, 1.5],
    gridW: GRID_W, // 44
    gridH: GRID_H, // 62
    iters: STIFFNESS_ITERS, // 10
    live: true,
    pointerWind: true, // mouse OR touch — the gust path branches on pointerType
    post: true,
    antialias: true,
  },
  [TIER.MOBILE]: {
    dpr: [1, 1.25], // lowered Android fill-rate cap (was [1, 1.5])
    gridW: 32,
    gridH: 46,
    iters: 8,
    live: true,
    pointerWind: true, // Part B: a finger drag drives the SAME wind-gust as the desktop mouse
    post: false, // drop the screen-space vignette on weak Android (was true)
    antialias: false, // capped DPR covers edges; skip MSAA on mobile GPUs
  },
  [TIER.LOW_END]: {
    dpr: [1, 1], // hard DPR 1
    gridW: 20, // ~60% of MOBILE — accept the more faceted look for the lightness
    gridH: 28,
    iters: 4, // few relaxation passes (structural stiffness is already at the stable max 1.0)
    live: true, // NOW a LIVE, interactive cloth (reduced quality) — no longer a static drape
    pointerWind: true, // touch gust ON (same wind path as MOBILE)
    post: false, // no grain / vignette
    antialias: false, // no MSAA
    cheapMaterial: true, // unlit MeshBasic + baked crease AO — no PBR / normal maps / lighting
  },
};

export function tierConfig(tier) {
  return TIER_CONFIG[tier] || TIER_CONFIG[TIER.DESKTOP];
}
