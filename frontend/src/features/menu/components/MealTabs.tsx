import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { MealType } from "@/types/menu";
import { cn } from "@/utils/cn";
import { SunDim, Sun, Moon } from "lucide-react";

interface MealTabsProps {
  activeTab: MealType;
  onChangeTab: (tab: MealType) => void;
}

export function MealTabs({ activeTab, onChangeTab }: MealTabsProps) {
  const tabs: { id: MealType; label: string; icon: ReactNode }[] = [
    {
      id: "breakfast",
      label: "Café da Manhã",
      icon: <SunDim className="w-4 h-4" />,
    },
    {
      id: "lunch",
      label: "Almoço",
      icon: <Sun className="w-4 h-4" />,
    },
    {
      id: "dinner",
      label: "Jantar",
      icon: <Moon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full mb-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-1.5 shadow-2xs">
      <div className="flex items-center justify-between relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                "relative z-10 flex-1 flex items-center justify-center gap-2 py-3 text-xs sm:text-sm font-semibold transition-colors duration-200 select-none rounded-xl",
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-400 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
              )}
            >
              {/* Fundo deslizante animado com Framer Motion */}
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-blue-50 dark:bg-zinc-800/80 rounded-xl -z-10 shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Ícone com cor condicional */}
              <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}>
                {tab.icon}
              </span>

              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
