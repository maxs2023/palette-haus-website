/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        accent: { DEFAULT: "#EDEDED", soft: "#C3BABA" },
        cta: "#8D9A72",
        text: "#1A1A1A"
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,0.05)"
      },
      fontFamily: {
        display: ["var(--font-playfair)","serif"],
        body: ["var(--font-inter)","sans-serif"]
      }
    },
  },
  plugins: [],
};
