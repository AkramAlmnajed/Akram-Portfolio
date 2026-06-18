import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import CurtainCloth from './CurtainCloth';
import CurtainWelcome from './CurtainWelcome';
import CurtainOpenButton from './CurtainOpenButton';
import './curtainIntro.css';

// Camera framing the cloth. +Z points toward the viewer (the wind direction).
const CAMERA_FOV = 45;
const CAMERA_Z = 6;

// Total open time before the layer fully unmounts (>= the cloth's lift duration).
const OPEN_DURATION_MS = 1100;

// The fixed, full-viewport layer above <App/>: a transparent <Canvas> carrying the cloth, an
// instant-paint CSS drape, the welcome overlay, and the gold "enter" arrow. On open the whole
// simulated curtain flies up, then everything unmounts (onClose).
export default function CurtainFabric({ onClose }) {
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

  // After the fly-up, unmount the whole layer.
  useEffect(() => {
    if (!opening) return undefined;
    const id = window.setTimeout(onClose, OPEN_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [opening, onClose]);

  return (
    <div className="curtain-root">
      <Canvas
        className="curtain-canvas"
        flat
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, CAMERA_Z], fov: CAMERA_FOV }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <CurtainCloth onReady={handleClothReady} opening={opening} />
      </Canvas>

      {/* Instant-paint placeholder + no-WebGL fallback; fades out once the opaque cloth paints. */}
      <div
        className={`curtain-drape${clothReady ? ' curtain-drape--hidden' : ''}`}
        aria-hidden="true"
      />

      <CurtainWelcome opening={opening} />
      <CurtainOpenButton onOpen={open} opening={opening} />
    </div>
  );
}
