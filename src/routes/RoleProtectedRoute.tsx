import React, { type JSX } from "react";
import { Navigate, useParams } from "react-router-dom";

interface RoleProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[]; // roles permitidos en esta ruta
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const { domain } = useParams<{ domain: string }>();

  if (!user) {
    // No logueado → login
    return <Navigate to={domain ? `/${domain}/login` : "/"} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Rol no permitido → redirigir a dashboard
    return <Navigate to={`/${domain}/dashboard`} replace />;
  }

  return children;
};
