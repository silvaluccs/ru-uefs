import { useNetworkCheck } from "@/features/menu/hooks/useMenu";

export function NetworkStatusCard() {
  const { data, isLoading } = useNetworkCheck();
  const isOnNetwork = data?.is_uefs_network ?? false;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white dark:bg-zinc-900 ${
        isOnNetwork
          ? "border-emerald-200/60 dark:border-emerald-900/40"
          : "border-red-200/60 dark:border-red-900/40"
      }`}
    >
      <span className="relative flex w-2.5 h-2.5 shrink-0">
        {isOnNetwork && (
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
        )}
        <span
          className={`relative w-2.5 h-2.5 rounded-full ${
            isOnNetwork ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
      </span>
      <div className="flex-1 leading-tight">
        <p className="text-sm font-bold text-gray-900 dark:text-zinc-50">Rede UEFS</p>
        <p
          className={`text-xs font-semibold ${
            isLoading
              ? "text-gray-400 dark:text-zinc-500"
              : isOnNetwork
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isLoading
            ? "Verificando..."
            : isOnNetwork
            ? "Conectado · voto liberado"
            : "Desconectado · voto bloqueado"}
        </p>
      </div>
    </div>
  );
}
