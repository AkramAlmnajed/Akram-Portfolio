// Tiny singleton so the navbar (and skip link) can drive the shared Lenis
// instance for anchor jumps. null when Lenis is disabled (reduced motion).
let instance = null;
export const setLenis = (value) => {
  instance = value;
};
export const getLenis = () => instance;
