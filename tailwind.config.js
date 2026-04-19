/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
        bodyFont: ["Manrope", "Poppins", "sans-serif"],
        titleFont: ["Sora", "Montserrat", "sans-serif"],
      },
      colors: {
        bodyColor: "#0B1120",
        lightText: "#94a3b8", // slate-400
        boxBg: "#111b33",
        designColor: "#3B82F6", // blue-500
        designColorHover: "#60A5FA",
      },
      boxShadow: {
        shadowOne: "0 10px 30px -10px rgba(2, 6, 23, 0.5)",
      },
    },
  },
  plugins: [],
};
