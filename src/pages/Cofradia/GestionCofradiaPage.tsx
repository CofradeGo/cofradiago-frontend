import React from "react";
import { useParams } from "react-router-dom";
import { useCofradias } from "../../hooks/useCofradias";
import { CofradiaHeader } from "../../components/molecules/CofradiaHeader";
import { useCortejos } from "../../hooks/useCortejo";
import { CortejosCarousel } from "../../components/organisms/CortejosCarousel";
import { usePuestos } from "../../hooks/usePuesto";
import { useCargos } from "../../hooks/useCargo"; // 🚀 Hook de cargos
import { ListCard } from "../../components/organisms/ListCard";
import type { Cofradia } from "../../types/Cofradia";

export const GestionCofradiaPage: React.FC = () => {
  const { cofradiaId } = useParams<{ cofradiaId: string }>();
  const { cofradiasActivas, loading, error } = useCofradias();

  // Cofradía seleccionada
  const cofradia: Cofradia | null = React.useMemo(() => {
    if (!cofradiaId) return null;
    const id = Number(cofradiaId);
    if (isNaN(id)) return null;
    return cofradiasActivas.find((c) => c.id === id) || null;
  }, [cofradiaId, cofradiasActivas]);

  // Cortejos
  const {
    cortejos,
    loading: loadingCortejos,
    error: errorCortejos,
  } = useCortejos(cofradia?.id || 0);

  // Puestos
  const { puestosUI, loading: loadingPuestos, error: errorPuestos } = usePuestos(cofradia?.id || 0);

  // Cargos
  const { cargosUI, loading: loadingCargos, error: errorCargos } = useCargos(cofradia?.id || 0);

  if (loading) return <p>Cargando cofradía...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!cofradia) return <p className="text-gray-600">Cofradía no encontrada</p>;

  // ================= Handlers =================
  const handleEditCofradia = () => console.log("Editar cofradía", cofradia.id);
  const handleDeleteCofradia = () => console.log("Eliminar cofradía", cofradia.id);
  const handleCloneCofradia = () => console.log("Clonar cofradía", cofradia.id);

  const handleViewCortejo = (id: number) => console.log("Ver cortejo", id);
  const handleEditCortejo = (id: number) => console.log("Editar cortejo", id);
  const handleDeleteCortejo = (id: number) => console.log("Eliminar cortejo", id);
  const handleAddCortejo = () => console.log("Añadir cortejo");

  const handleAddPuesto = () => console.log("Añadir puesto");
  const handleEditPuesto = (id: number) => console.log("Editar puesto", id);

  const handleAddCargo = () => console.log("Añadir cargo");
  const handleEditCargo = (id: number) => console.log("Editar cargo", id);

  // ================= Render =================
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

      {/* Puestos y Cargos */}
      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Puestos / Cargos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Puestos */}
          {loadingPuestos ? (
            <p>Cargando puestos...</p>
          ) : errorPuestos ? (
            <p className="text-red-600">{errorPuestos}</p>
          ) : (
            <ListCard
              type="puestos"
              items={puestosUI}
              onEdit={handleEditPuesto}
              onAdd={handleAddPuesto}
            />
          )}

          {/* Card Cargos */}
          {loadingCargos ? (
            <p>Cargando cargos...</p>
          ) : errorCargos ? (
            <p className="text-red-600">{errorCargos}</p>
          ) : (
            <ListCard
              type="cargos"
              items={cargosUI} // recuerda importar cargosUI desde el hook useCargos
              onEdit={handleEditCargo}
              onAdd={handleAddCargo}
            />
          )}
        </div>
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
