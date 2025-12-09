// src/routes/PrivateRoute.tsx
import React, { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const userStr = localStorage.getItem("user");
  const domain = localStorage.getItem("domain");
  const location = useLocation();

  // No hay usuario o dominio → login
  if (!userStr || !domain) {
    return <Navigate to={`/${domain || ""}/login`} replace />;
  }

  // Si la ruta no coincide con el dominio → redirige al dashboard
  if (!location.pathname.startsWith(`/${domain}`)) {
    return <Navigate to={`/${domain}/dashboard`} replace />;
  }

  return children;
};
