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
import { GestionCofradiaPage } from "./pages/Cofradia/GestionCofradiaPage";

import { RoleProtectedRoute } from "./routes/RoleProtectedRoute";
import { PrivateRoute } from "./routes/PrivateRoute";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

// Redirección segura al dashboard
const RedirectToDashboard: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const userStr = localStorage.getItem("user");

  if (!userStr) {
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
        {/* Ruta principal del dashboard */}
        <Route index element={<DashboardPage />} />

        {/* Rutas específicas primero */}
        <Route
          path="cofradia/:cofradiaId/gestionar"
          element={
            <RoleProtectedRoute allowedRoles={["DMG"]}>
              <GestionCofradiaPage />
            </RoleProtectedRoute>
          }
        />

        {/* Rutas genéricas después */}
        <Route
          path="cofradia"
          element={
            <RoleProtectedRoute allowedRoles={["DMG", "AUXILIAR"]}>
              <CofradiaPage />
            </RoleProtectedRoute>
          }
        />

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

        {/* Ruta comodín dentro del dashboard */}
        <Route path="*" element={<DashboardPage />} />
      </Route>

      {/* Redirección global para rutas inválidas dentro del dominio */}
      <Route path="/:domain/*" element={<RedirectToDashboard />} />

      {/* Redirección global para cualquier otra ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Reseteo de contraseña */}
      <Route path="/:domain/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
};
