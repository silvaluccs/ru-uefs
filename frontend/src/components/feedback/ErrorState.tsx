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
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm mx-auto min-h-[300px] animate-fade-in">
      <div className="p-3 bg-red-50 text-red-500 rounded-full mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
