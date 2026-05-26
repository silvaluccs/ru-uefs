import { useEffect, useState } from "react";
import { Utensils } from "lucide-react";

const FRASES_DIVERTIDAS = [
  "Acordando o servidor do RU... Ele deve ter esquecido de ligar o despertador.",
  "Preparando as panelas virtuais da UEFS. Um momento...",
  "Se o servidor demorar mais que a fila do RU, a gente reinicia...",
  "Esperando a boa vontade do servidor gratuito... Quem sabe ele acorda no próximo minuto?",
  "Alguém printa e manda lá no Gossip UEFS que o servidor tá travando a fila!",
  "Demorando mais que a parcela do mais futuro desse mês...",
  "Rodando o algoritmo para descobrir quem foi que furou a fila hoje...",
  "Aguardando a boa vontade da API, do mesmo jeito que espero o e-mail do orientador...",
  "Processando as requisições mais rápido do que quem corre para não perder o direta..",
  "Tentando lembrar a senha do SAGRES para saber se falto hoje ou não...",
  "Procurando o cozinheiro chefe da API... Ah, ele já está vindo!",
  "Procurando o cardápio tal como um aluno de ecomp procura um estágio...",
];

export function WakingUpState() {
  const [fraseIndex, setFraseIndex] = useState(() =>
    Math.floor(Math.random() * FRASES_DIVERTIDAS.length),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIndex(() => Math.floor(Math.random() * FRASES_DIVERTIDAS.length));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div
          className="absolute w-20 h-20 border-4 border-blue-100 dark:border-blue-950/40 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"
          style={{ animationDuration: "1.5s" }}
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-2xl animate-pulse border border-transparent dark:border-blue-900/20">
          <Utensils className="w-8 h-8" />
        </div>
      </div>

      <div className="space-y-2 max-w-70">
        <h3 className="text-lg font-bold text-gray-900 dark:text-zinc-100 tracking-tight flex items-center justify-center gap-2">
          <span>O Servidor está acordando</span>
        </h3>

        <p className="text-sm text-gray-500 dark:text-zinc-400 min-h-10 transition-all duration-300 leading-relaxed">
          {FRASES_DIVERTIDAS[fraseIndex]}
        </p>
      </div>
    </div>
  );
}
