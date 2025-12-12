import React, { useState } from "react";
import { HermandadInfo } from "../../components/organisms/HermandadInfo";
import { EditHermandadModal } from "../../components/molecules/EditHermandadModal";
import { useHermandad } from "../../hooks/useHermandad";

export const HermandadPage: React.FC = () => {
  const domain = localStorage.getItem("domain") || "default";
  const { data: hermandad, loading, error, updateHermandad, refetch } = useHermandad(domain, true);
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) return <p className="text-center mt-10">Cargando información...</p>;
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!hermandad) return <p className="text-center mt-10">Hermandad no encontrada</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Hermandad</h1>

      <HermandadInfo
        domain={domain}
        hermandad={hermandad}
        openEditModal={() => setModalOpen(true)}
      />

      <EditHermandadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        hermandad={hermandad}
        updateHermandad={updateHermandad}
        onUpdated={refetch}
      />
    </div>
  );
};
