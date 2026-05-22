import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ← ESSA LINHA É CRUCIAL! Ela avisa ao Tailwind para ler seus componentes
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        surface: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
