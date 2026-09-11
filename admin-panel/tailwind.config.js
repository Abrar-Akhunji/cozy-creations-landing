/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.08)",
        background: "#0d0e12",
        card: "#151720",
        primary: {
          DEFAULT: "#8D9B82", // Sage/Earth tone matching Crochet Shop branding
          hover: "#7c8b70",
          light: "rgba(141, 155, 130, 0.15)",
        },
        accent: {
          pink: "#D4A3A9",
          blue: "#4B7095",
          beige: "#C4A484",
        },
        text: {
          primary: "#f3f4f6",
          secondary: "#9ca3af",
          muted: "#6b7280"
        }
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        card: "0 10px 30px 0 rgba(0, 0, 0, 0.25)",
      }
    },
  },
  plugins: [],
}
