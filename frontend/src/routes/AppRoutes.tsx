import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { HomePage } from "@/pages/Home";
import { WeeklyPage } from "@/pages/Weekly";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/hoje" replace />} />
          <Route path="/hoje" element={<HomePage />} />
          <Route path="/semanal" element={<WeeklyPage />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="p-8 text-center font-medium">
              404 - Não encontrado
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
