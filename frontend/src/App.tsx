import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppRoutes } from "@/routes/AppRoutes";
import { VacationState } from "@/components/feedback/VacationState";
import { Analytics } from "@vercel/analytics/react";
import { OfflineBanner } from "@/components/feedback/OfflineBanner";
const IS_VACATION_MODE = import.meta.env.VITE_IS_VACATION === "true";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-950 dark:text-zinc-50 transition-colors duration-300">
          {IS_VACATION_MODE ? <VacationState /> : <AppRoutes />}
          <OfflineBanner />
        </div>
      </ThemeProvider>
      <Analytics />
    </>
  );
}
