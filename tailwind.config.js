/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // hover: utilities only apply on devices that truly hover (no sticky hover
  // states after a tap on touch screens). Lets us use hover transforms freely.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "500px",
        md: "667px",
        mdl: "768px",
        lg: "960px",
        lgl: "1024px",
        xl: "1280px",
      },
      fontFamily: {
        // Family KEYS unchanged so existing font-titleFont / font-bodyFont
        // classes keep working; only the underlying faces change.
        bodyFont: ["Manrope", "system-ui", "sans-serif"],
        // Elegant high-contrast Garamond display face used at 600–700 for the
        // masthead and headings. Fancy and legible with real weight.
        titleFont: ['"Cormorant Garamond"', "Cormorant", "Georgia", "serif"],
        monoFont: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // ── "Calibrated Broadsheet" tokens (AA-verified where used as text) ──
        bg: "#16161A", // warm dark grey (lifted from near-black)
        surface: "#1D1D22",
        surfaceRaised: "#25252B",
        ink: "#F1EFE9", // 16.8:1 on bg
        inkMuted: "#A4A199", // 7.5:1 on bg
        inkSubtle: "#6E6C66", // 3.67:1 — LARGE / decorative only, never body text
        line: "rgba(241,239,233,0.10)",
        lineStrong: "rgba(241,239,233,0.18)",
        // Near-monochrome warm BONE accent. Carries meaning via contrast/weight,
        // not hue. Use ONLY for active/strongest states + focus ticks, sparingly.
        accent: "#C9A227", // champagne — 7.97:1 as text on bg
        accentText: "#0E0E11", // dark ink for text ON the champagne accent (7.97:1)
        accentDim: "#9A7C1C", // darker champagne — hover/borders (4.84:1)
        success: "#7FB069", // 7.6:1 on bg — reserved for true success states
        danger: "#E8552A", // semantic error color only

        // ── Legacy aliases (only referenced by dead files now; removed in step 13) ──
        bodyColor: "#0E0E11",
        lightText: "#A4A199",
        boxBg: "#16161A",
        designColor: "#C9A227", // = accent
        designColorHover: "#9A7C1C", // = accentDim
      },
      fontSize: {
        display: ["clamp(3rem, 9vw, 7.5rem)", { lineHeight: "1.0", letterSpacing: "0" }],
        numeral: ["clamp(3rem, 6vw, 4.5rem)", { lineHeight: "1.0", letterSpacing: "-0.01em" }],
        h1: ["3.052rem", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        h2: ["2.441rem", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        h3: ["1.953rem", { lineHeight: "1.15" }],
        h4: ["1.563rem", { lineHeight: "1.2" }],
        bodyLg: ["1.25rem", { lineHeight: "1.55" }],
        body: ["1rem", { lineHeight: "1.65" }],
        small: ["0.8rem", { lineHeight: "1.5" }],
        mono: ["0.8rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
      },
      borderRadius: {
        none: "0px",
        hairline: "2px",
        control: "4px",
      },
      boxShadow: {
        // Warm, opaque, low-spread contact shadows.
        contact:
          "0 1px 0 rgba(255,255,255,0.03) inset, 0 16px 32px -28px rgba(0,0,0,0.75)",
        raised:
          "0 1px 0 rgba(255,255,255,0.04) inset, 0 28px 56px -34px rgba(0,0,0,0.82)",
        accentTick: "0 0 0 1px rgba(232,85,42,0.55)",
        // ── Luminous warm-gold glows (negative spread = soft halo, not a ring) ──
        glow: "0 14px 60px -26px rgba(201,162,39,0.30), 0 1px 0 rgba(255,255,255,0.03) inset",
        glowHover: "0 18px 72px -22px rgba(201,162,39,0.50), 0 1px 0 rgba(255,255,255,0.04) inset",
        glowPortrait:
          "0 0 90px -22px rgba(201,162,39,0.42), 0 28px 70px -34px rgba(0,0,0,0.78)",
        glowAccent: "0 6px 26px -6px rgba(201,162,39,0.55)",
        glowButton: "0 10px 36px -12px rgba(201,162,39,0.55)",
        // Legacy alias
        shadowOne: "0 10px 30px -10px rgba(2, 6, 23, 0.5)",
      },
      letterSpacing: {
        tightest: "-0.02em",
      },
      transitionTimingFunction: {
        // Strong custom curves (Emil): never the weak built-ins, never ease-in for UI.
        out: "cubic-bezier(0.2, 0, 0, 1)", // overrides default ease-out with a stronger one
        reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
        flip: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "160ms",
        base: "240ms",
        slow: "320ms",
        reveal: "560ms",
      },
    },
  },
  plugins: [],
};
