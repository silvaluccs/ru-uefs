import { useEffect, useState } from "react";
import { Utensils, Loader2 } from "lucide-react";

const FRASES_DIVERTIDAS = [
  "Acordando o servidor do RU... Ele deve ter esquecido de ligar o despertador.",
  "Preparando as panelas virtuais da UEFS. Um momento...",
  "O servidor do Render está tomando um café antes de liberar o cardápio.",
  "Calculando a quantidade exata de suco de umbu para hoje...",
  "Procurando o cozinheiro chefe da API... Ah, ele já está vindo!",
  "Garantindo que a soja em grão ao sugo saia no capricho...",
];

export function WakingUpState() {
  const [fraseIndex, setFraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIndex((prev) => (prev + 1) % FRASES_DIVERTIDAS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div
          className="absolute w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"
          style={{ animationDuration: "1.5s" }}
        />

        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl animate-pulse">
          <Utensils className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-2 max-w-[280px]">
        <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center justify-center gap-2">
          <span>O Servidor está acordando</span>
        </h3>
        <p className="text-sm text-gray-500 min-h-[40px] transition-all duration-300">
          {FRASES_DIVERTIDAS[fraseIndex]}
        </p>
      </div>
    </div>
  );
}
