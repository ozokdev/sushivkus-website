"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Имитация задержки сети
    await new Promise((r) => setTimeout(r, 800));

    if (email === "admin@sushivkus.ru" && password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else {
      setError("Неверный логин или пароль");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
          {/* Логотип */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black">
              <span className="text-accent">Суши</span>{" "}
              <span className="text-white">Вкус</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Панель управления</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sushivkus.ru"
                required
                className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 transition-colors w-full"
              />
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-gray-400 text-sm mb-1.5">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-accent/50 transition-colors w-full pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Ошибка */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2"
              >
                {error}
              </motion.p>
            )}

            {/* Кнопка */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white rounded-xl px-4 py-3 font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
