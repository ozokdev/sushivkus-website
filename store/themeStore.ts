import { create } from "zustand";

interface ThemeState {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      // Класс на html для Tailwind
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("light-mode", next === "light");
      }
      return { theme: next };
    }),
}));
