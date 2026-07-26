import { Card } from "@/components/ui/Card";
import { MealRating } from "./MealRating";
import {
  Salad,
  UtensilsCrossed,
  Coffee,
  HelpCircle,
  Soup,
  Utensils,
  Sandwich,
  Citrus,
  Vegan,
  CookingPot,
  Clock,
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
  dateStr?: string;
  hideRatingButtons?: boolean;
}

export function MealCard({
  title,
  sections = [],
  isCurrent = false,
  isOpen = false,
  isLastServed = false,
  dateStr = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-"),
  hideRatingButtons = false,
}: MealCardProps) {
  const getMealType = (): "desjejum" | "almoco" | "jantar" => {
    const t = title.toLowerCase();
    if (t.includes("café") || t.includes("desjejum")) return "desjejum";
    if (t.includes("almoço")) return "almoco";
    return "jantar";
  };

  const mealType = getMealType();
  const localStorageKey = `ru-vote:${dateStr}-${mealType}`;

  const getMealTimeLimit = () => {
    if (mealType === "desjejum") return "09:00";
    if (mealType === "almoco") return "13:30";
    return "19:00";
  };

  const isFutureMeal = (): boolean => {
    try {
      const todayString = new Date().toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      });
      const [todayDay, todayMonth, todayYear] = todayString
        .split("/")
        .map(Number);
      const today = new Date(todayYear, todayMonth - 1, todayDay);

      const [cardDay, cardMonth, cardYear] = dateStr.split("-").map(Number);
      const cardDate = new Date(cardYear, cardMonth - 1, cardDay);

      return cardDate > today;
    } catch (e) {
      return false;
    }
  };

  const hideRating = isFutureMeal();

  // Estilos de Ícones & Cores fieis ao mockup
  const getSectionStyle = (sectionTitle: string) => {
    const t = sectionTitle.toLowerCase();
    if (t.includes("vegetariana"))
      return {
        icon: <Vegan className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
        bg: "bg-emerald-100/70 dark:bg-emerald-950/50",
        isVegetarian: true,
      };
    if (t.includes("pã") || t.includes("carboidrato"))
      return {
        icon: <Sandwich className="w-5 h-5 text-amber-700 dark:text-amber-500" />,
        bg: "bg-amber-100/70 dark:bg-amber-950/50",
        isVegetarian: false,
      };
    if (t.includes("principal") || t.includes("proteína"))
      return {
        icon: <UtensilsCrossed className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
        bg: "bg-rose-100/70 dark:bg-rose-950/50",
        isVegetarian: false,
      };
    if (t.includes("raiz") || t.includes("farináceo"))
      return {
        icon: <Utensils className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
        bg: "bg-amber-100/70 dark:bg-amber-950/50",
        isVegetarian: false,
      };
    if (t.includes("fruta"))
      return {
        icon: <Citrus className="w-5 h-5 text-red-500 dark:text-red-400" />,
        bg: "bg-red-100/70 dark:bg-red-950/50",
        isVegetarian: false,
      };
    if (t.includes("bebida") || t.includes("suco"))
      return {
        icon: <Coffee className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
        bg: "bg-blue-100/70 dark:bg-blue-950/50",
        isVegetarian: false,
      };
    if (t.includes("sopa"))
      return {
        icon: <Soup className="w-5 h-5 text-orange-600 dark:text-orange-400" />,
        bg: "bg-orange-100/70 dark:bg-orange-950/50",
        isVegetarian: false,
      };
    if (t.includes("guarnição"))
      return {
        icon: <CookingPot className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
        bg: "bg-violet-100/70 dark:bg-violet-950/50",
        isVegetarian: false,
      };
    if (t.includes("salada"))
      return {
        icon: <Salad className="w-5 h-5 text-green-600 dark:text-green-400" />,
        bg: "bg-green-100/70 dark:bg-green-950/50",
        isVegetarian: false,
      };

    return {
      icon: <Utensils className="w-5 h-5 text-gray-600 dark:text-gray-400" />,
      bg: "bg-gray-100 dark:bg-zinc-800",
      isVegetarian: false,
    };
  };

  if (!sections || sections.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500 flex flex-col items-center justify-center min-h-[220px] rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xs">
        <HelpCircle className="w-10 h-10 text-gray-300 dark:text-zinc-600 mb-3" />
        <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">
          Informações não disponíveis
        </p>
        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
          Nenhum item foi lançado para esta refeição.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-xs transition-all duration-300">
      {/* Header do Card (Título + Status) */}
      <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-50 tracking-tight">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 dark:text-zinc-400">
              <span>{isCurrent && isOpen ? "Servindo agora" : "Horário limite"}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3" /> até {getMealTimeLimit()}
              </span>
            </div>
          </div>
        </div>

        {/* Lógica de Badges Restaurada */}
        {isCurrent && isOpen && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Servindo agora
          </span>
        )}

        {isCurrent && !isOpen && !isLastServed && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Vai servir
          </span>
        )}

        {isCurrent && !isOpen && isLastServed && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Última refeição
          </span>
        )}
      </div>

      {/* Lista de Alimentos */}
      <div className="divide-y divide-gray-100 dark:divide-zinc-800/60">
        {sections.map((section, index) => {
          const { icon, bg, isVegetarian } = getSectionStyle(section.title);

          return (
            <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-0.5">
                  {section.title}
                </span>

                <div className="space-y-0.5">
                  {section.items.map((item, itemIdx) => (
                    <p
                      key={itemIdx}
                      className={`text-sm sm:text-base ${
                        isVegetarian
                          ? "text-emerald-600 dark:text-emerald-400 font-bold"
                          : "text-gray-800 dark:text-zinc-100 font-semibold"
                      }`}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Avaliação no rodapé do card */}
      {!hideRating && (
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800/80">
          <MealRating
            localStorageKey={localStorageKey}
            dateStr={dateStr}
            mealType={mealType}
            isVoteAllowed={isCurrent && isOpen}
            hideButtons={hideRatingButtons}
          />
        </div>
      )}
    </Card>
  );
}
