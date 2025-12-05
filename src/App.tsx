import React, { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { DomainRedirect } from "./routes/DomainRedirect";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return <Navigate to="/login" replace />;
  return children;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<HomePage />} />

      {/* Login público */}
      <Route path="/:domain/login" element={<LoginPage />} />

      {/* Redirección automática al login si solo se entra a /:domain */}
      <Route path="/:domain" element={<DomainRedirect />} />

      {/* Dashboard privado y rutas hijas */}
      <Route
        path="/:domain/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        {/* Aquí se agregarán futuras páginas privadas */}
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold text-gray-700">404 - Página no encontrada</h1>
          </div>
        }
      />
    </Routes>
  );
};
