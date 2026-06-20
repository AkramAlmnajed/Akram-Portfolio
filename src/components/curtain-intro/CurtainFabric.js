import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CurtainCloth from './CurtainCloth';
import CurtainWelcome from './CurtainWelcome';
import CurtainOpenButton from './CurtainOpenButton';
import CurtainCanvasBoundary from './CurtainCanvasBoundary';
import { detectTier, tierConfig, getGpuRenderer } from './deviceTier';
import { isWebGLAvailable } from './isWebGLAvailable';
import './curtainIntro.css';

// Camera framing the cloth. +Z points toward the viewer (the wind direction).
const CAMERA_FOV = 45;
const CAMERA_Z = 6;

// Total open time before the layer fully unmounts (>= the cloth's lift duration).
const OPEN_DURATION_MS = 1100;

// Debug-only: publish the resolved tier + GPU string to window.__tier (no UI, no logging)
// so they can be read in remote DevTools. Flip to false to disable.
const EXPOSE_TIER = true;

// The fixed, full-viewport layer above <App/>: a transparent <Canvas> carrying the cloth, an
// instant-paint CSS drape, the welcome overlay, and the gold "enter" arrow. On open the whole
// simulated curtain flies up (or, on the static tiers, fades/lifts), then everything unmounts.
export default function CurtainFabric({ onClose }) {
  // prefers-reduced-motion: skip the live sim entirely and render the static, pre-baked LOW_END
  // drape; the reveal is a simple opacity fade (no fly-up). Honors the user's motion setting.
  const reducedMotion = useMemo(
    () =>
      Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
    [],
  );

  // Pick the performance tier once, at mount. Every tier is now a LIVE interactive cloth; the
  // tier only sets the quality ceiling (the runtime scaler in CurtainCloth scales DOWN from it).
  const tier = useMemo(() => detectTier(), []);
  const config = useMemo(() => tierConfig(tier), [tier]);

  // The interactive cloth runs on EVERY WebGL-capable device. The static CSS drape is reserved
  // for exactly three cases: no WebGL, a context creation/loss failure, or OS reduced-motion.
  const webglOk = useMemo(() => isWebGLAvailable(), []);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const useCanvas = webglOk && !canvasFailed && !reducedMotion;

  // Debug-only: publish tier + GPU string + whether the static drape is showing to window.__tier.
  useEffect(() => {
    if (EXPOSE_TIER) {
      window.__tier = { ...(window.__tier || {}), tier, gpu: getGpuRenderer(), static: !useCanvas };
    }
  }, [tier, useCanvas]);

  const [clothReady, setClothReady] = useState(false);
  const handleClothReady = useCallback(() => setClothReady(true), []);

  const [opening, setOpening] = useState(false);
  const openingRef = useRef(false);

  // Single-flight: the first trigger wins; later presses/triggers are ignored.
  const open = useCallback(() => {
    if (openingRef.current) return;
    openingRef.current = true;
    setOpening(true);
  }, []);

  // After the open animation, unmount the whole layer.
  useEffect(() => {
    if (!opening) return undefined;
    const id = window.setTimeout(onClose, OPEN_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [opening, onClose]);

  // NOTE: R3F already frees the GPU context on unmount (it calls renderLists.dispose() +
  // forceContextLoss() internally), and CurtainCloth disposes the geometry/material in its own
  // cleanups — so we do NOT add a second teardown here. The desktop "white flash for ~1s after the
  // reveal" was a Chrome dual-GPU artifact: a `powerPreference:'high-performance'` context (R3F's
  // default, which we were also setting) moves the page COMPOSITOR onto the discrete GPU, and
  // destroying that context on unmount switches the compositor back to the integrated GPU — a
  // full-page recomposite that flashes white. Using `powerPreference:'default'` (below) keeps the
  // context on the compositor's GPU, so teardown is seamless.

  const handleContextLost = useCallback((event) => {
    event.preventDefault(); // we degrade to the static drape rather than attempt a restore
    setCanvasFailed(true);
  }, []);

  // Every live cloth flies up via the sim; only the static-drape path (no Canvas) reveals with a
  // plain opacity fade of the whole overlay.
  const fadeRoot = opening && !useCanvas;

  return (
    <div className={`curtain-root${fadeRoot ? ' curtain-root--fade' : ''}`}>
      {useCanvas && (
        <CurtainCanvasBoundary onError={() => setCanvasFailed(true)}>
          <Canvas
            className="curtain-canvas"
            flat
            dpr={config.dpr}
            frameloop={config.live ? 'always' : 'demand'}
            gl={{ alpha: true, antialias: config.antialias, powerPreference: 'default' }}
            camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
            }}
          >
            <CurtainCloth onReady={handleClothReady} opening={opening} config={config} />
          </Canvas>
        </CurtainCanvasBoundary>
      )}

      {/* Instant-paint placeholder + no-WebGL / reduced-motion fallback. With a live Canvas it
          fades out once the opaque cloth paints; with no Canvas it stays as the static drape
          panel and reveals via the root fade. */}
      <div
        className={`curtain-drape${useCanvas && clothReady ? ' curtain-drape--hidden' : ''}`}
        aria-hidden="true"
      />

      <CurtainWelcome opening={opening} />
      <CurtainOpenButton onOpen={open} opening={opening} />
    </div>
  );
}
