/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary: deep purple (logo outer ring)
        "primary": "#5B2D8E",
        "primary-container": "#7B42B8",
        "primary-fixed": "#C9A6E8",
        "primary-fixed-dim": "#A87DD4",
        "on-primary": "#ffffff",
        "on-primary-container": "#F0E2FF",
        "on-primary-fixed": "#1A0040",
        "on-primary-fixed-variant": "#481F78",
        "inverse-primary": "#C9A6E8",

        // Secondary: cerulean blue (logo inner circle)
        "secondary": "#1175A8",
        "secondary-container": "#1E9FD4",
        "secondary-fixed": "#B8E4F7",
        "secondary-fixed-dim": "#7DCAEC",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#003A52",
        "on-secondary-fixed": "#001E2E",
        "on-secondary-fixed-variant": "#0A5A84",

        // Surface / background: clean off-white
        "surface": "#FAF8FF",
        "surface-bright": "#FAF8FF",
        "surface-dim": "#E2DDF0",
        "surface-variant": "#E8E2F4",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#F4F0FB",
        "surface-container": "#EEE8FA",
        "surface-container-high": "#E8E2F4",
        "surface-container-highest": "#E2DCF0",
        "surface-tint": "#5B2D8E",

        // On-surface
        "on-surface": "#1C1A24",
        "on-surface-variant": "#4A4358",
        "on-background": "#1C1A24",
        "background": "#FAF8FF",

        // Tertiary: warm gold accent
        "tertiary": "#B8760A",
        "tertiary-container": "#D4960E",
        "tertiary-fixed": "#FFE8B0",
        "tertiary-fixed-dim": "#FFCF6A",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#FFE8B0",
        "on-tertiary-fixed": "#3A2000",
        "on-tertiary-fixed-variant": "#8A5800",

        // Outline
        "outline": "#7A7289",
        "outline-variant": "#CBC4D8",

        // Inverse
        "inverse-surface": "#302B3E",
        "inverse-on-surface": "#F4F0FB",

        // Error
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem",
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans"],
        body: ["Inter"],
        label: ["Manrope"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
