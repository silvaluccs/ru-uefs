import { Outlet, NavLink } from "react-router-dom";
import { CalendarDays, Clock, Utensils, Sun, Moon } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

export function MainLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex flex-col antialiased transition-colors duration-300">
      {/* Header estilo Clean Mockup */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl h-16 px-4 sm:px-6 flex items-center justify-between">

          {/* Logo & Subtítulo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-xs">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-zinc-50 tracking-tight text-base leading-tight">
                Menu RU
              </span>
              <span className="text-xs text-gray-400 dark:text-zinc-400 font-normal">
                UEFS • Feira de Santana
              </span>
            </div>
          </div>

          {/* Nav Links + Theme Switcher */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <NavLink
              to="/hoje"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200",
                  "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100/60 dark:hover:bg-zinc-900",
                  isActive &&
                    "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-semibold"
                )
              }
            >
              <Clock className="w-4 h-4" />
              <span>Hoje</span>
            </NavLink>

            <NavLink
              to="/semanal"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200",
                  "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100/60 dark:hover:bg-zinc-900",
                  isActive &&
                    "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/50 font-semibold"
                )
              }
            >
              <CalendarDays className="w-4 h-4" />
              <span>Semanal</span>
            </NavLink>

            <button
              onClick={toggleTheme}
              className="p-2 ml-1 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100/80 dark:hover:bg-zinc-900 rounded-xl transition-all"
              aria-label="Alternar tema"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          </nav>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
