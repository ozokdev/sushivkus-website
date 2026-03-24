import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#09090b",
        accent: "#ef4444",
        "accent-hover": "#dc2626",
        "accent-light": "#f87171",
        "accent-soft": "rgba(239,68,68,0.1)",
        surface: "#18181b",
        "surface-hover": "#27272a",
        muted: "#71717a",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)",
        "card-hover": "0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(239,68,68,0.08)",
        glow: "0 0 25px rgba(239,68,68,0.25)",
        "glow-hover": "0 0 40px rgba(239,68,68,0.4)",
        modal: "0 25px 60px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
