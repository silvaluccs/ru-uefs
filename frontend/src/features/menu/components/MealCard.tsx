import { Card } from "@/components/ui/Card";
import {
  Salad,
  UtensilsCrossed,
  Coffee,
  Sparkles,
  HelpCircle,
  Soup,
  ChefHat,
  Utensils,
  Sandwich,
  Citrus,
  Vegan,
  CookingPot,
  CalendarDays,
  History,
} from "lucide-react";

interface MealSection {
  title: string;
  items: string[];
}

interface MealCardProps {
  title: string;
  sections?: MealSection[];
  isCurrent?: boolean;
  isOpen?: boolean;
  isLastServed?: boolean;
}

export function MealCard({
  title,
  sections = [],
  isCurrent = false,
  isOpen = false,
  isLastServed = false,
}: MealCardProps) {
  const getSectionStyle = (sectionTitle: string) => {
    const t = sectionTitle.toLowerCase();

    if (t.includes("vegetariana")) {
      return {
        icon: <Vegan className="w-4 h-4 text-emerald-500" />,
        highlight: true,
      };
    }
    if (t.includes("principal") || t.includes("proteína")) {
      return {
        icon: <UtensilsCrossed className="w-4 h-4 text-amber-600" />,
        highlight: false,
      };
    }
    if (t.includes("bebida") || t.includes("suco")) {
      return {
        icon: <Coffee className="w-4 h-4 text-blue-500" />,
        highlight: false,
      };
    }
    if (t.includes("sopa")) {
      return {
        icon: <Soup className="w-4 h-4 text-orange-500" />,
        highlight: false,
      };
    }
    if (t.includes("pã")) {
      return {
        icon: <Sandwich className="w-4 h-4 text-amber-800" />,
        highlight: false,
      };
    }
    if (t.includes("acompanhamento")) {
      return {
        icon: <Utensils className="w-4 h-4 text-cyan-600" />,
        highlight: false,
      };
    }
    if (t.includes("guarnição")) {
      return {
        icon: <CookingPot className="w-4 h-4 text-amber-700" />,
        highlight: false,
      };
    }
    if (t.includes("raiz") || t.includes("farináceo")) {
      return {
        icon: <Utensils className="w-4 h-4 text-yellow-600" />,
        highlight: false,
      };
    }
    if (t.includes("salada")) {
      return {
        icon: <Salad className="w-4 h-4 text-green-500" />,
        highlight: false,
      };
    }

    return {
      icon: <Citrus className="w-4 h-4 text-red-500" />,
      highlight: false,
    };
  };

  if (!sections || sections.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-55">
        <HelpCircle className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-sm font-medium">Informações não disponíveis</p>
        <p className="text-xs text-gray-400 mt-1">
          Nenhum item foi lançado para esta refeição.
        </p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden p-6 transition-all duration-300 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-xs">
      {isCurrent && isOpen && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 animate-pulse border border-blue-100 dark:border-blue-900/50">
          <Sparkles className="w-3 h-3" />
          Servindo agora
        </span>
      )}

      {isCurrent && !isOpen && isLastServed && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
          <History className="w-3.5 h-3.5" />
          Última refeição servida
        </span>
      )}

      {isCurrent && !isOpen && !isLastServed && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/60">
          <CalendarDays className="w-3.5 h-3.5" />
          Vai servir
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4 tracking-tight flex items-center gap-2">
        <ChefHat className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
        {title}
      </h3>

      <div className="divide-y divide-gray-50 dark:divide-zinc-800/50">
        {sections.map((section, index) => {
          const { icon, highlight } = getSectionStyle(section.title);

          return (
            <div
              key={index}
              className="py-3.5 border-b border-gray-50 dark:border-zinc-800/50 last:border-0 first:pt-0"
            >
              <div className="flex items-center gap-2 mb-1.5 text-gray-400 dark:text-zinc-500">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  {section.title}
                </span>
              </div>

              <ul className="space-y-1">
                {section.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className={`text-sm leading-relaxed ${
                      highlight
                        ? "text-emerald-700 dark:text-emerald-400 font-semibold"
                        : "text-gray-700 dark:text-zinc-300 font-medium"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
