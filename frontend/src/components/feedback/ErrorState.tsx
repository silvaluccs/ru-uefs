import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Ops! Algo deu errado",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto min-h-75 animate-fade-in">
      <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-full mb-4 border border-transparent dark:border-red-900/30">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <h3 className="font-semibold text-gray-900 dark:text-zinc-100 text-lg mb-1">
        {title}
      </h3>

      <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
