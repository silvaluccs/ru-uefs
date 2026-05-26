import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppRoutes } from "@/routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-950 dark:text-zinc-50 transition-colors duration-300">
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}
