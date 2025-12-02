import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/:domain/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-700">404 - Página no encontrada</h1>
          </div>
        }
      />
      <Route path="/:domain/dashboard" element={<DashboardPage />} />
    </Routes>
  );
};
