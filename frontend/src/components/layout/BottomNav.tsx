import { NavLink } from "react-router-dom";
import { Clock, CalendarDays, Users } from "lucide-react";
import { cn } from "@/utils/cn";

const TABS = [
  { to: "/hoje", label: "Hoje", icon: Clock },
  { to: "/semanal", label: "Semana", icon: CalendarDays },
  { to: "/fila", label: "Fila", icon: Users },
];

export function BottomNav() {
  return (
    <nav className="shrink-0 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 bg-gradient-to-t from-white via-white/95 dark:from-zinc-950 dark:via-zinc-950/95 to-transparent">
      <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-1.5 shadow-[0_12px_34px_-12px_rgba(0,0,0,0.25)]">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-colors duration-200",
                isActive
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40"
                  : "text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300",
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
