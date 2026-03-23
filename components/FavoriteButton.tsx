"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favoritesStore";

export default function FavoriteButton({
  id,
  className = "",
}: {
  id: number;
  className?: string;
}) {
  const toggle = useFavoritesStore((s) => s.toggle);
  const isFav = useFavoritesStore((s) => s.ids.includes(id));

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={(e) => {
        e.stopPropagation();
        toggle(id);
      }}
      className={`p-1.5 rounded-lg transition-colors ${
        isFav
          ? "text-red-500"
          : "text-white/50 hover:text-white/80"
      } ${className}`}
      title={isFav ? "Удалить из избранного" : "В избранное"}
      aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <Heart
        className="w-5 h-5"
        fill={isFav ? "currentColor" : "none"}
      />
    </motion.button>
  );
}
