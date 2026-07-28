import { WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "@/features/menu/hooks/useOnlineStatus";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-600 dark:bg-red-900 text-white px-4 py-2 text-center text-xs sm:text-sm font-medium shadow-md flex items-center justify-center gap-2"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Você está offline. Verifique sua conexão com a internet.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
