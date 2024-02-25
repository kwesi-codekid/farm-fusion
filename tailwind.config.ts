import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
      backgroundImage: {
        "custom-dark":
          "linear-gradient(to bottom, rgba(20,10,30, 0.8), rgba(10,20,35, 0.8)),url('assets/imgs/connected-dots-bg.jpg')",
        "custom-light":
          "linear-gradient(to bottom, rgba(20,10,30, 0.8), rgba(10,20,35, 0.8)),url('assets/imgs/blue-colorful.jpeg')",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
