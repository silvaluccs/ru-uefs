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
} from "lucide-react";

interface SecaoRefeicao {
  titulo: string;
  itens: string[];
}

interface MealCardProps {
  title: string;
  secoes?: SecaoRefeicao[];
  isCurrent?: boolean;
  isOpen?: boolean; // Nova propriedade para saber se o RU está aberto no momento
}

export function MealCard({
  title,
  secoes = [],
  isCurrent = false,
  isOpen = false, // Padrão falso caso não seja enviado (ex: na tela semanal)
}: MealCardProps) {
  // Define o ícone e se a seção deve ter o destaque verde original do ovolactovegetariano
  const getEstiloSecao = (titulo: string) => {
    const t = titulo.toLowerCase();

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

    // Sobremesas / Frutas
    return {
      icon: <Citrus className="w-4 h-4 text-red-500" />,
      highlight: false,
    };
  };

  if (!secoes || secoes.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-[220px]">
        <HelpCircle className="w-8 h-8 text-gray-300 mb-2" />
        <p className="text-sm font-medium">Informações não disponíveis</p>
        <p className="text-xs text-gray-400 mt-1">
          Nenhum item foi lançado para esta refeição.
        </p>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden p-6 transition-all duration-300 bg-white border-gray-100 shadow-xs">
      {/* Condicional do Badge Superior Direito */}
      {isCurrent &&
        (isOpen ? (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 animate-pulse border border-blue-100">
            <Sparkles className="w-3 h-3" />
            Servindo agora
          </span>
        ) : (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            <CalendarDays className="w-3.5 h-3.5" />
            Vai servir
          </span>
        ))}

      <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight flex items-center gap-2">
        <ChefHat className="w-4 h-4 text-gray-400" />
        {title}
      </h3>

      <div className="divide-y divide-gray-50">
        {secoes.map((secao, index) => {
          const { icon, highlight } = getEstiloSecao(secao.titulo);

          return (
            <div
              key={index}
              className="py-3.5 border-b border-gray-50 last:border-0 first:pt-0"
            >
              {/* Cabeçalho da Seção com Ícone Colorido e Texto Neutro */}
              <div className="flex items-center gap-2 mb-1.5 text-gray-400">
                {icon}
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {secao.titulo}
                </span>
              </div>

              {/* Listagem de Alimentos Alinhados à Esquerda */}
              <ul className="space-y-1">
                {secao.itens.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className={`text-sm leading-relaxed ${
                      highlight
                        ? "text-emerald-700 font-semibold"
                        : "text-gray-700 font-medium"
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
