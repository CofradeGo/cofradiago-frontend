import React, { useState } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useHermandad } from "../../hooks/useHermandad";
import { ProfileCard } from "../../components/molecules/ProfileCard";
import { EditUserModal } from "../../components/molecules/EditUserModal";

export const PerfilPage: React.FC = () => {
  const { user, setUser, loading: loadingUser } = useCurrentUser();
  const domain = localStorage.getItem("domain") || "";
  const { data: hermandad, loading: loadingHermandad } = useHermandad(domain, true);

  const [isModalOpen, setModalOpen] = useState(false);

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

  const openModal = () => setModalOpen(true);

  return (
    <div className="max-w-xl mx-auto">
      <ProfileCard
        username={user.username}
        email={user.email}
        hermandadName={hermandad.name}
        onEdit={openModal} // botón de editar
      />

      {isModalOpen && (
        <EditUserModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          initialUsername={user.username}
          initialEmail={user.email}
          onUserUpdated={(updatedUser) => setUser(updatedUser)} // actualizar datos en el hook
        />
      )}
    </div>
  );
};
