import { NavLink } from "react-router-dom";
import { Clock, CalendarDays, Users, Utensils, Sun, Moon } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTheme } from "@/contexts/ThemeContext";
import { useRestaurantStatus } from "@/features/menu/hooks/useMenu";

const TABS = [
  { to: "/hoje", label: "Hoje", icon: Clock },
  { to: "/semanal", label: "Semana", icon: CalendarDays },
  { to: "/fila", label: "Fila", icon: Users },
];

export function SidebarNav() {
  const { theme, toggleTheme } = useTheme();
  const { data: status } = useRestaurantStatus();
  const isOpen = status?.isOpen ?? false;

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5">
      <div className="flex items-center gap-2.5 px-1 mb-8">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Utensils className="w-4.5 h-4.5" />
        </div>
        <div className="leading-tight">
          <p className="font-extrabold text-gray-900 dark:text-zinc-50">Menu RU</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500">UEFS · Feira de Santana</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-900",
              )
            }
          >
            <Icon className="w-[18px] h-[18px]" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-3 px-3.5 py-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
        <span className="relative flex w-2.5 h-2.5 shrink-0">
          {isOpen && (
            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
          )}
          <span
            className={`relative w-2.5 h-2.5 rounded-full ${isOpen ? "bg-emerald-500" : "bg-amber-500"}`}
          />
        </span>
        <div className="flex-1 min-w-0 leading-tight">
          <p className="text-[13px] font-bold truncate text-gray-900 dark:text-zinc-50">
            {isOpen ? "Servindo agora" : "Fechado"}
          </p>
          <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
            {status?.badgeText ?? "Verificando status..."}
          </p>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </div>
    </aside>
  );
}
