import type { MealType } from "@/types/menu";
import { cn } from "@/utils/cn";

interface MealTabsProps {
  activeTab: MealType;
  onChangeTab: (tab: MealType) => void;
}

export function MealTabs({ activeTab, onChangeTab }: MealTabsProps) {
  const tabs: { id: MealType; label: string }[] = [
    { id: "breakfast", label: "Café da Manhã" },
    { id: "lunch", label: "Almoço" },
    { id: "dinner", label: "Jantar" },
  ];

  const getTranslateClass = (tab: MealType) => {
    switch (tab) {
      case "breakfast":
        return "translate-x-0";
      case "lunch":
        return "translate-x-full";
      case "dinner":
        return "translate-x-[200%]";
      default:
        return "translate-x-0";
    }
  };

  return (
    <div className="relative flex bg-gray-50/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-gray-100 dark:border-zinc-800/80 w-full mb-6 transition-colors duration-300">
      <div
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(33.3333%-4px)] rounded-lg bg-white dark:bg-zinc-800 shadow-xs border border-gray-100 dark:border-zinc-700/50 transition-transform duration-300 ease-out",
          getTranslateClass(activeTab),
        )}
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={cn(
              "flex-1 text-center py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 select-none relative z-10",
              isActive
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-gray-400 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
