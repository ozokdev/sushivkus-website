"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  MapPin,
  ImageIcon,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Users,
  Bell,
  BarChart3,
  Bot,
  Gift,
  Download,
  Layers,
} from "lucide-react";

const allNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { href: "/admin/orders", label: "Заказы", icon: ClipboardList, roles: ["admin"] },
  { href: "/admin/menu", label: "Меню", icon: UtensilsCrossed, roles: ["admin", "menu_editor"] },
  { href: "/admin/categories", label: "Категории", icon: Layers, roles: ["admin", "menu_editor"] },
  { href: "/admin/wok", label: "WOK", icon: UtensilsCrossed, roles: ["admin", "menu_editor"] },
  { href: "/admin/customers", label: "Клиенты", icon: Users, roles: ["admin"] },
  { href: "/admin/analytics", label: "Аналитика", icon: BarChart3, roles: ["admin"] },
  { href: "/admin/delivery", label: "Доставка", icon: MapPin, roles: ["admin"] },
  { href: "/admin/banners", label: "Баннеры", icon: ImageIcon, roles: ["admin"] },
  { href: "/admin/promos", label: "Промокоды", icon: Tag, roles: ["admin"] },
  { href: "/admin/promotions", label: "Акции", icon: Gift, roles: ["admin"] },
  { href: "/admin/notifications", label: "Уведомления", icon: Bell, roles: ["admin"] },
  { href: "/admin/telegram", label: "Telegram", icon: Bot, roles: ["admin"] },
  { href: "/admin/export", label: "Экспорт", icon: Download, roles: ["admin"] },
  { href: "/admin/settings", label: "Настройки", icon: Settings, roles: ["admin"] },
];

function getPageTitle(pathname: string) {
  const item = allNavItems.find((n) => n.href === pathname);
  return item?.label || "Админ";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState("admin");

  // Логин бетинде layout'ту көрсөтпө
  const isLoginPage = pathname === "/admin/login";

  const navItems = allNavItems.filter((item) => item.roles.includes(role));

  useEffect(() => {
    document.documentElement.className = "dark-mode";
    const auth = localStorage.getItem("admin_auth");
    const savedRole = localStorage.getItem("admin_role") || "admin";
    setRole(savedRole);
    if (!auth && !isLoginPage) {
      router.push("/admin/login");
    } else {
      setAuthed(true);
    }
    setChecking(false);
  }, [router, isLoginPage]);

  // Логин бети — layout жок
  if (isLoginPage) return <>{children}</>;

  // Текшерүүдө
  if (checking || !authed) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111] border-r border-white/10 h-screen sticky top-0">
        {/* Логотип */}
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-xl font-black">
            <span className="text-accent">Суши</span>{" "}
            <span className="text-white">Вкус</span>
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">Администратор</p>
        </div>

        {/* Навигация */}
        <nav className="flex-1 px-3 mt-6 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-accent/10 text-accent border-l-2 border-accent"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Чыгуу */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[#111] border-r border-white/10 z-50 lg:hidden flex flex-col"
            >
              {/* Логотип + жабуу */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black">
                    <span className="text-accent">Суши</span>{" "}
                    <span className="text-white">Вкус</span>
                  </h1>
                  <p className="text-gray-500 text-xs mt-0.5">Администратор</p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Навигация */}
              <nav className="flex-1 px-3 mt-6 space-y-1">
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-accent/10 text-accent border-l-2 border-accent"
                          : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              {/* Чыгуу */}
              <div className="px-3 pb-6">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full"
                >
                  <LogOut className="w-5 h-5" />
                  Выйти
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-white/10 px-4 lg:px-6 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold">{getPageTitle(pathname)}</h2>
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span className="hidden sm:block">admin@sushivkus.ru</span>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
