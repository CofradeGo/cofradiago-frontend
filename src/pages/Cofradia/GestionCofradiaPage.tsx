import React from "react";
import { useParams } from "react-router-dom";
import { useCofradias } from "../../hooks/useCofradias";
import { CofradiaHeader } from "../../components/molecules/CofradiaHeader";
import { useCortejos } from "../../hooks/useCortejo";
import { CortejosCarousel } from "../../components/organisms/CortejosCarousel";
import type { Cofradia } from "../../types/Cofradia";

export const GestionCofradiaPage: React.FC = () => {
  const { cofradiaId } = useParams<{ cofradiaId: string }>();
  const { cofradiasActivas, loading, error } = useCofradias();

  // Derivamos la cofradía seleccionada
  const cofradia: Cofradia | null = React.useMemo(() => {
    if (!cofradiaId) return null;
    const id = Number(cofradiaId);
    if (isNaN(id)) return null;
    return cofradiasActivas.find((c) => c.id === id) || null;
  }, [cofradiaId, cofradiasActivas]);

  // Hook de cortejos de esta cofradía
  const {
    cortejos,
    loading: loadingCortejos,
    error: errorCortejos,
  } = useCortejos(cofradia?.id || 0);

  if (loading) return <p>Cargando cofradía...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!cofradia) return <p className="text-gray-600">Cofradía no encontrada</p>;

  // Handlers de la cabecera
  const handleEditCofradia = () => console.log("Editar cofradía", cofradia.id);
  const handleDeleteCofradia = () => console.log("Eliminar cofradía", cofradia.id);
  const handleCloneCofradia = () => console.log("Clonar cofradía", cofradia.id);

  // Handlers de cortejos
  const handleViewCortejo = (id: number) => console.log("Ver cortejo", id);
  const handleEditCortejo = (id: number) => console.log("Editar cortejo", id);
  const handleDeleteCortejo = (id: number) => console.log("Eliminar cortejo", id);
  const handleAddCortejo = () => console.log("Añadir cortejo");

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <CofradiaHeader
        cofradia={cofradia}
        onEdit={handleEditCofradia}
        onDelete={handleDeleteCofradia}
        onClone={handleCloneCofradia}
      />

      {/* Cortejos */}
      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Cortejos</h2>
        {loadingCortejos ? (
          <p>Cargando cortejos...</p>
        ) : errorCortejos ? (
          <p className="text-red-600">{errorCortejos}</p>
        ) : (
          <CortejosCarousel
            cortejos={cortejos}
            onView={handleViewCortejo}
            onEdit={handleEditCortejo}
            onDelete={handleDeleteCortejo}
            onAdd={handleAddCortejo}
          />
        )}
      </section>

      {/* Puestos / Insignias / Cargos */}
      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Puestos / Insignias / Cargos</h2>
        <p className="text-gray-500">Aquí irá el carrusel de puestos, insignias y cargos...</p>
      </section>

      {/* Papeleta de Sitio */}
      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Papeleta de Sitio</h2>
        <p className="text-gray-500">Formulario de papeleta en construcción...</p>
      </section>

      {/* Hermanos */}
      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">Hermanos</h2>
        <p className="text-gray-500">Listado paginado de hermanos con filtros...</p>
      </section>
    </div>
  );
};
