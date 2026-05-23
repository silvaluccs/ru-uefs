import { Outlet, NavLink } from "react-router-dom";
import { CalendarDays, Clock, Utensils } from "lucide-react";
import { cn } from "@/utils/cn";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md h-auto">
        <div className="mx-auto max-w-5xl min-h-[4rem] sm:h-16 px-4 pt-3 pb-2 sm:py-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-gray-900 tracking-tight block text-sm sm:text-base leading-none">
                Menu RU
              </span>
              <span className="text-xs text-gray-400 font-medium">
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
                  "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                  isActive &&
                    "text-blue-600 bg-blue-50/60 hover:text-blue-600 hover:bg-blue-50/60",
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
                  "text-gray-500 hover:text-gray-900 hover:bg-gray-50",
                  isActive &&
                    "text-blue-600 bg-blue-50/60 hover:text-blue-600 hover:bg-blue-50/60",
                )
              }
            >
              <CalendarDays className="w-4 h-4" />
              <span>Semanal</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
