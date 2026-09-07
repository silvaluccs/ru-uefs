import { HelpCircle } from "lucide-react";
import { ItemSwipeDeck } from "./ItemSwipeDeck";
import { flattenMealItems } from "@/features/menu/utils/flattenMealItems";
import type { MealSection } from "@/features/menu/utils/adaptMealData";

interface MealFeedSectionProps {
  title: string;
  timeLabel: string;
  sections: MealSection[];
  isCurrent: boolean;
  isOpen: boolean;
  isLastServed: boolean;
  dateStr: string;
  mealType: "desjejum" | "almoco" | "jantar";
  accent: {
    text: string;
    dot: string;
    glow: string;
  };
}

export function MealFeedSection({
  title,
  timeLabel,
  sections,
  isCurrent,
  isOpen,
  isLastServed,
  dateStr,
  mealType,
  accent,
}: MealFeedSectionProps) {
  const statusBadge = isCurrent
    ? isOpen
      ? { label: "Servindo agora", classes: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400", pulse: true }
      : isLastServed
      ? { label: "Última refeição", classes: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400", pulse: false }
      : { label: "Vai servir", classes: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400", pulse: false }
    : { label: "Fora de horário", classes: "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400", pulse: false };

  const items = flattenMealItems(sections);

  return (
    <section className="relative h-full min-h-full snap-start snap-always flex flex-col overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full"
        style={{
          background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative pt-20 px-5">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${statusBadge.classes}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} ${statusBadge.pulse ? "animate-pulse" : ""}`} />
          {statusBadge.label}
        </div>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-zinc-400 font-medium">{timeLabel}</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-center pb-14">
        {sections.length === 0 ? (
          <div className="relative mx-5 mb-4 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 p-8 flex flex-col items-center text-center gap-2">
            <HelpCircle className="w-8 h-8 text-gray-300 dark:text-zinc-600" />
            <p className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
              Informações não disponíveis
            </p>
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              Nenhum item foi lançado para esta refeição.
            </p>
          </div>
        ) : (
          <ItemSwipeDeck
            items={items}
            dateStr={dateStr}
            mealType={mealType}
            canVote={isCurrent && isOpen}
            accentDot={accent.dot}
          />
        )}
      </div>
    </section>
  );
}
