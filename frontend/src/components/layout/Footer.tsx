import { Info } from "lucide-react";

export function Footer() {
  return (
    <footer className="pt-10 mt-6 border-t border-gray-200/60 dark:border-zinc-800/80 text-center space-y-6 pb-8 animate-fade-in">
      {/* Disclaimer Section */}
      <div className="flex items-start gap-3 bg-white/80 dark:bg-zinc-900/80 text-gray-600 dark:text-zinc-400 text-left p-5 rounded-2xl border border-gray-200/60 dark:border-zinc-800 max-w-3xl mx-auto text-sm leading-relaxed shadow-sm backdrop-blur-md">
        <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-gray-900 dark:text-zinc-200 font-semibold">Aviso Importante:</strong> Este é um projeto totalmente{" "}
          <strong className="text-gray-900 dark:text-zinc-200 font-semibold">independente</strong> e não possui vínculo oficial com a administração da universidade. O cardápio exibido está sujeito a alterações sem aviso prévio.
        </p>
      </div>

      {/* Credits & Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-zinc-500 font-medium max-w-3xl mx-auto px-2">
        <span>Desenvolvido com 💙 por Lucas Silva para a comunidade.</span>
        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com/in/silvaluccs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/silvaluccs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-zinc-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 rounded-md px-1"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
