import { useCallback, useEffect, useState } from 'react';
import CurtainFabric from './CurtainFabric';

// Dev flag: force the curtain to show on every load during the build so each step can be
// verified by reloading. Step 8 gates this behind the once-per-session logic for production.
const FORCE_SHOW = true;

// sessionStorage key — the curtain shows once per browser session (finalized in Step 8).
const SESSION_KEY = 'curtain-intro-shown';

function computeShouldShow() {
  if (FORCE_SHOW) return true;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) !== 'shown';
  } catch {
    // sessionStorage can throw in private/locked-down modes — fail open (show the curtain).
    return true;
  }
}

// Session gate + scroll lock. Mounts the full-viewport curtain layer beside <App/>.
export default function CurtainIntro() {
  const [visible, setVisible] = useState(computeShouldShow);

  // Called when the open animation completes: unmount the layer and mark the session shown.
  const handleClose = useCallback(() => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(SESSION_KEY, 'shown');
    } catch {
      // ignore — sessionStorage may be unavailable; the curtain simply shows again next time.
    }
  }, []);

  // Lock background scrolling while the curtain is mounted (closed AND during the wipe-up);
  // release exactly on unmount. The viewport scroller here is <html> (index.css sets
  // `html { overflow-x: hidden }`, so the viewport takes html's overflow, not body's), and the
  // page scrolls the wheel through Lenis smooth-scroll — so locking <body> alone does nothing.
  // We lock <html> (freezes native wheel/touch/keyboard) and swallow the wheel in the capture
  // phase before Lenis processes it (so it can't smooth-scroll or bank virtual scroll that would
  // jump on release). Save -> restore once, StrictMode double-invocation safe; no parallel lock.
  useEffect(() => {
    if (!visible) return undefined;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    const blockWheel = (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener('wheel', blockWheel, { capture: true, passive: false });

    return () => {
      window.removeEventListener('wheel', blockWheel, { capture: true });
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [visible]);

  if (!visible) return null;
  return <CurtainFabric onClose={handleClose} />;
}
