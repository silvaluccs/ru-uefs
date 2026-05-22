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

  return (
    <div className="flex border-b border-gray-100 w-full mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={cn(
              "flex-1 text-center py-3 text-sm font-medium border-b-2 transition-all duration-200 relative -mb-[2px]",
              isActive
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-400 hover:text-gray-600",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
