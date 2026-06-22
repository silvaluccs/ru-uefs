import { useEffect, useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";

const FRASES_SISTEMA_OFF = [
  "O recesso vem e vai, mas a nossa vontade de comer no RU continua intacta.",
  "Preparando o sistema para o próximo ciclo enquanto você atualiza o SAGRES de 5 em 5 minutos.",
  "Partiu rodoviária! Todo mundo voltando para o interior e a API em modo de descanso.",
  "Segurando as pontas na infraestrutura tal como você segura a sua última média.",
  "Aproveitando o recesso acadêmico para limpar as panelas da nossa API.",
  "Refatorando a casa para garantir que no próximo semestre a fila ande mais rápido que o Direta.",
  "Nosso código foi passar uns dias em Cabuçu junto com a galera de Ecomp.",
  "Calculando se o estoque de suco de caju do RU resiste ao tempo.",
];

export function VacationState() {
  const [fraseIndex, setFraseIndex] = useState(() =>
    Math.floor(Math.random() * FRASES_SISTEMA_OFF.length),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFraseIndex(() =>
        Math.floor(Math.random() * FRASES_SISTEMA_OFF.length),
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto min-h-75 animate-fade-in">
      <div className="p-3 bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-400 rounded-full mb-4 border border-gray-200 dark:border-zinc-800">
        <Calendar className="w-6 h-6" />
      </div>

      <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-lg mb-2">
        Site em Manutenção
      </h3>

      <p className="text-sm font-medium text-gray-800 dark:text-zinc-300 min-h-10 leading-relaxed mb-5 px-1">
        {FRASES_SISTEMA_OFF[fraseIndex]}
      </p>

      <div className="space-y-4 text-xs text-gray-700 dark:text-zinc-400 border-t border-gray-200 dark:border-zinc-800/80 pt-4 w-full">
        <p className="leading-relaxed">
          O aplicativo está passando por atualizações estruturais programadas.
          Nosso site retornará às atividades normais junto com o fluxo do
          próximo período letivo (2026.2).
        </p>

        <p className="leading-relaxed">
          Se o restaurante estiver em período de funcionamento, você pode
          conferir os comunicados oficiais e os cardápios diários diretamente no
          portal da pró-reitoria:
        </p>

        <a
          href="http://www.propaae.uefs.br/modules/conteudo/conteudo.php?conteudo=15"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-zinc-200 bg-gray-50 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200 w-full justify-center active:scale-[0.99]"
        >
          <span>Consultar Portal da PROPAAE</span>
          <ExternalLink className="w-4 h-4 text-gray-600 dark:text-zinc-400" />
        </a>
      </div>
    </div>
  );
}
