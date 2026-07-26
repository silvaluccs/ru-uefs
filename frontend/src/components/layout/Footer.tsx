import { Info } from "lucide-react";


export function Footer() {

  return (
      <footer className="pt-8 border-t border-gray-200/60 dark:border-zinc-800/80 text-center space-y-4">
        <div className="flex items-start gap-3 bg-white/80 dark:bg-zinc-900/80 text-gray-500 dark:text-zinc-400 text-left p-4 rounded-2xl border border-gray-200/60 dark:border-zinc-800 max-w-3xl mx-auto text-xs leading-relaxed shadow-xs">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-700 dark:text-zinc-300">Aviso:</strong> Este é um projeto totalmente{" "}
            <strong>independente</strong> e não possui vínculo oficial com a administração da UEFS. O cardápio exibido está sujeito a alterações pela instituição.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-400 dark:text-zinc-500 font-medium max-w-3xl mx-auto">
          <span>Desenvolvido por Lucas Silva</span>
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com/in/silvaluccs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/silvaluccs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 dark:hover:text-zinc-200 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>


  );

}
