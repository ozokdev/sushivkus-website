import { create } from "zustand";

interface ThemeState {
  theme: "dark" | "light";
  toggleTheme: () => void;
  initTheme: () => void;
}

function getStoredTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return "light"; // дефолт — ак режим
}

function applyTheme(theme: "dark" | "light") {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("light-mode", theme === "light");
  document.documentElement.classList.toggle("dark-mode", theme === "dark");
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      applyTheme(next);
      return { theme: next };
    }),
  initTheme: () => {
    const theme = getStoredTheme();
    applyTheme(theme);
    set({ theme });
  },
}));
