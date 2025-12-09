import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";

import { LoginPage } from "./pages/auth/LoginPage";
import { HomePage } from "./pages/HomePage";
import { DashboardLayout } from "./components/layouts/DashboardLayout";

// Dashboard pages
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { UsuariosPage } from "./pages/Usuarios/UsuariosPage";
import { HermandadPage } from "./pages/Hermandad/HermandadPage";
import { HermanosPage } from "./pages/Hermanos/HermanosPage";
import { CofradiaPage } from "./pages/Cofradia/CofradiaPage";
import { PapeletaPage } from "./pages/Papeleta/PapeletaPage";
import { NotificacionesPage } from "./pages/Notificaciones/NotificacionesPage";
import { PerfilPage } from "./pages/Perfil/PerfilPage";

import { RoleProtectedRoute } from "./routes/RoleProtectedRoute";
import { PrivateRoute } from "./routes/PrivateRoute";

// Componente que redirige a dashboard de manera segura
const RedirectToDashboard: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const userStr = localStorage.getItem("user");

  if (!userStr) {
    // Si no está logueado, lleva al login del dominio actual o raíz
    return <Navigate to={`/${domain || ""}/login`} replace />;
  }

  if (domain) {
    return <Navigate to={`/${domain}/dashboard`} replace />;
  }

  return <Navigate to="/" replace />;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<HomePage />} />

      {/* Login público */}
      <Route path="/:domain/login" element={<LoginPage />} />

      {/* Dashboard privado con rutas hijas */}
      <Route
        path="/:domain/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="usuarios"
          element={
            <RoleProtectedRoute allowedRoles={["DMG"]}>
              <UsuariosPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="hermandad"
          element={
            <RoleProtectedRoute allowedRoles={["DMG"]}>
              <HermandadPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="hermanos"
          element={
            <RoleProtectedRoute allowedRoles={["DMG", "AUXILIAR"]}>
              <HermanosPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="cofradia"
          element={
            <RoleProtectedRoute allowedRoles={["DMG", "AUXILIAR"]}>
              <CofradiaPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="papeletas"
          element={
            <RoleProtectedRoute allowedRoles={["DMG", "AUXILIAR"]}>
              <PapeletaPage />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="notificaciones"
          element={
            <RoleProtectedRoute allowedRoles={["DMG", "AUXILIAR"]}>
              <NotificacionesPage />
            </RoleProtectedRoute>
          }
        />
        <Route path="perfil" element={<PerfilPage />} />

        {/* Cualquier ruta inválida dentro de dashboard → redirige a dashboard */}
        <Route path="*" element={<DashboardPage />} />
      </Route>

      {/* Redirección global de cualquier ruta inválida dentro de un dominio */}
      <Route path="/:domain/*" element={<RedirectToDashboard />} />

      {/* Cualquier otra ruta pública inválida */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
