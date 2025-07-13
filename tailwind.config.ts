import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#091515",
        background: "#f5fafa",
        primary: "#58bbb9",
        secondary: "#97afd3",
        accent: "#7a84c7",
      },
      fontFamily: {
        sans: ["Cabinet Grotesk", "Arial", "Helvetica", "sans-serif"],
        alt: ["Hind", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
