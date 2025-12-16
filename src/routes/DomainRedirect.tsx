import React from "react";
import { useParams, Navigate } from "react-router-dom";

/**
 * Componente para redirigir automáticamente a la ruta de login
 * cuando se accede solo a /:domain
 */
export const DomainRedirect: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();

  if (!domain) {
    // Si no hay dominio en la URL, enviamos al Home
    return <Navigate to="/" replace />;
  }

  // Redirige a /:domain/login
  return <Navigate to={`/${domain}/login`} replace />;
};
