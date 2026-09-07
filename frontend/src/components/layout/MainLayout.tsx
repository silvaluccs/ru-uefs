import { Outlet } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRestaurantStatus } from "@/features/menu/hooks/useMenu";
import { BottomNav } from "@/components/layout/BottomNav";
import { SidebarNav } from "@/components/layout/SidebarNav";

export function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const { data: status } = useRestaurantStatus();

  const isOpen = status?.isOpen ?? false;

  return (
    <div className="h-dvh w-full flex justify-center lg:justify-start bg-gray-100 dark:bg-black lg:bg-white lg:dark:bg-zinc-950 transition-colors duration-300">
      <SidebarNav />

      <div className="flex-1 min-w-0 h-full flex justify-center lg:justify-start">
        {/* Mobile: moldura de telefone. Desktop: coluna de conteúdo cheia. */}
        <div className="relative w-full max-w-md lg:max-w-none h-full flex flex-col bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 overflow-hidden shadow-2xl lg:shadow-none">
          {/* Status pill flutuante — só no mobile, no desktop ela mora na sidebar */}
          <div className="lg:hidden absolute top-0 left-0 right-0 z-40 px-3 pt-3">
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-gray-100 dark:border-zinc-800 backdrop-blur-xl shadow-sm">
              <span className="relative flex w-2.5 h-2.5 shrink-0">
                {isOpen && (
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                )}
                <span
                  className={`relative w-2.5 h-2.5 rounded-full ${
                    isOpen ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-[13px] font-bold truncate">
                  RU UEFS · {isOpen ? "Servindo agora" : "Fechado"}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate">
                  {status?.badgeText ?? "Verificando status..."}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                aria-label="Alternar tema"
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>
            </div>
          </div>

          <main className="flex-1 min-h-0">
            <Outlet />
          </main>

          <div className="lg:hidden">
            <BottomNav />
          </div>
        </div>
      </div>
    </div>
  );
}
