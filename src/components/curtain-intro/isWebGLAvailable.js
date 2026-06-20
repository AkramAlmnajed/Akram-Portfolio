// Cheap, cached one-shot probe: can this browser create a WebGL context at all?
// Used to route to the static CSS drape BEFORE mounting <Canvas>, so a context-
// creation failure degrades cleanly instead of throwing / leaving a black panel.
let cached;

export function isWebGLAvailable() {
  if (cached !== undefined) return cached;
  cached = false;
  try {
    if (typeof window !== 'undefined' && window.WebGLRenderingContext) {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      cached = Boolean(gl);
      // Free the throwaway probe context immediately (don't hold a live context).
      const lose = gl && gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    }
  } catch {
    cached = false;
  }
  return cached;
}
