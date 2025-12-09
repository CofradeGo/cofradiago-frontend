import React from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useHermandad } from "../../hooks/useHermandad";
import { ProfileCard } from "../../components/molecules/ProfileCard";

export const PerfilPage: React.FC = () => {
  const { user, loading: loadingUser } = useCurrentUser();

  const domain = localStorage.getItem("domain") || "";
  const { data: hermandad, loading: loadingHermandad } = useHermandad(domain, true);

  if (loadingUser || loadingHermandad) {
    return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;
  }

  if (!user || !hermandad) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error al cargar el perfil
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <ProfileCard username={user.username} email={user.email} hermandadName={hermandad.name} />
    </div>
  );
};
