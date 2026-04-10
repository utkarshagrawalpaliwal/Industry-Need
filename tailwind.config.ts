import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f5f2ed",
        ink: "#0a0a0a",
        amber: {
          DEFAULT: "#d4860b",
          light: "#f0c96e",
        },
        steel: {
          DEFAULT: "#2c3038",
          light: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        serif: ["Instrument Serif", "serif"],
      },
      backgroundImage: {
        "noise": "url('/noise.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
