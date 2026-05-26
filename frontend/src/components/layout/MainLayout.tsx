import { Outlet, NavLink } from "react-router-dom";
import { CalendarDays, Clock, Utensils, Sun, Moon } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";

export function MainLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-50 flex flex-col antialiased transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md h-auto">
        <div className="mx-auto max-w-5xl min-h-16 sm:h-16 px-4 pt-3 pb-2 sm:py-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 dark:text-zinc-100 tracking-tight block text-sm sm:text-base leading-none">
                Menu RU
              </span>
              <span className="text-xs text-gray-400 dark:text-zinc-400 font-medium">
                Universidade Estadual de Feira de Santana
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/hoje"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900",
                  isActive &&
                    "text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/30",
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
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900",
                  isActive &&
                    "text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/30",
                )
              }
            >
              <CalendarDays className="w-4 h-4" />
              <span>Semanal</span>
            </NavLink>

            <button
              onClick={toggleTheme}
              className="p-2 ml-1 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded-lg transition-all duration-200"
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

      <main className="flex-1 w-full mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
