import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCofradias } from "../../hooks/useCofradias";
import { CofradiaHeader } from "../../components/molecules/CofradiaHeader";
import { ClonarCofradiaModal } from "../../components/organisms/ClonarCofradiaModal";
import { EditarCofradiaModal } from "../../components/organisms/EditarCofradiaModal"; // ✅ nuevo
import { useCortejos } from "../../hooks/useCortejo";
import { CortejosCarousel } from "../../components/organisms/CortejosCarousel";
import { usePuestos } from "../../hooks/usePuesto";
import { useCargos } from "../../hooks/useCargo";
import { useInsigniasWithElements } from "../../hooks/useInsigniasConElementos";
import { useTramos } from "../../hooks/useTramos";
import { ListCard } from "../../components/organisms/ListCard";
import type { Cofradia } from "../../types/Cofradia";
import { ROUTES } from "../../routes/routes";
import { getDomain } from "../../utils/domain"; // helper

export const GestionCofradiaPage: React.FC = () => {
  const { cofradiaId, domain: domainParam } = useParams<{ cofradiaId: string; domain: string }>();
  const navigate = useNavigate();

  // ✅ dominio robusto (param o fallback)
  const domain = domainParam || getDomain() || "";

  const { cofradiasActivas, loading, error, clonarCofradia, refetch } = useCofradias();

  // ===================== Cofradía actual =====================
  const cofradia: Cofradia | null = useMemo(() => {
    if (!cofradiaId) return null;
    const id = Number(cofradiaId);
    if (isNaN(id)) return null;
    return cofradiasActivas.find((c) => c.id === id) || null;
  }, [cofradiaId, cofradiasActivas]);

  // ===================== Modales =====================
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);
  const [cloneError, setCloneError] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false); // ✅ modal editar

  // ===================== Hooks dependientes =====================
  const {
    cortejos,
    loading: loadingCortejos,
    error: errorCortejos,
  } = useCortejos(cofradia?.id || 0);
  const { puestosUI, loading: loadingPuestos, error: errorPuestos } = usePuestos(cofradia?.id || 0);
  const { cargosUI, loading: loadingCargos, error: errorCargos } = useCargos(cofradia?.id || 0);
  const { insigniasUI } = useInsigniasWithElements(cofradia?.id || 0);
  const cortejoId = cortejos[0]?.id || 0;
  const { tramosUI } = useTramos(cofradia?.id || 0, cortejoId);

  // ===================== Guards =====================
  if (loading) return <p>Cargando cofradía...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!cofradia) return <p className="text-gray-600">Cofradía no encontrada</p>;

  // ===================== Handlers Cofradía =====================
  const handleEditCofradia = () => setEditModalOpen(true); // abre modal editar

  const handleDeleteCofradia = () => {
    console.log("Eliminar cofradía", cofradia.id);
  };

  const handleOpenClone = () => {
    setCloneError("");
    setCloneModalOpen(true);
  };

  const handleConfirmClone = async ({ anio }: { anio: number }) => {
    if (!cofradia || !domain) return;

    setCloneLoading(true);
    setCloneError("");

    try {
      await clonarCofradia(cofradia.id, anio);
      await refetch();
      setCloneModalOpen(false);

      navigate(ROUTES.cofradia(domain));
    } catch (err) {
      setCloneError(err instanceof Error ? err.message : "Error al clonar la cofradía");
    } finally {
      setCloneLoading(false);
    }
  };

  // ===================== Render =====================
  return (
    <div className="space-y-6">
      <CofradiaHeader
        cofradia={cofradia}
        onEdit={handleEditCofradia}
        onDelete={handleDeleteCofradia}
        onClone={handleOpenClone}
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
            onView={(id) => console.log("Ver cortejo", id)}
            onEdit={(id) => console.log("Editar cortejo", id)}
            onDelete={(id) => console.log("Eliminar cortejo", id)}
            onAdd={() => console.log("Añadir cortejo")}
          />
        )}
      </section>

      {/* Puestos / Cargos */}
      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Puestos / Cargos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadingPuestos ? (
            <p>Cargando puestos...</p>
          ) : errorPuestos ? (
            <p className="text-red-600">{errorPuestos}</p>
          ) : (
            <ListCard
              type="puestos"
              items={puestosUI}
              onEdit={(id) => console.log("Editar puesto", id)}
              onAdd={() => console.log("Añadir puesto")}
            />
          )}

          {loadingCargos ? (
            <p>Cargando cargos...</p>
          ) : errorCargos ? (
            <p className="text-red-600">{errorCargos}</p>
          ) : (
            <ListCard
              type="cargos"
              items={cargosUI}
              onEdit={(id) => console.log("Editar cargo", id)}
              onAdd={() => console.log("Añadir cargo")}
            />
          )}
        </div>
      </section>

      {/* Insignias / Tramos */}
      <section className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Insignias y Tramos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ListCard
            type="insignias"
            items={insigniasUI}
            onEdit={(id) => console.log("Editar insignia", id)}
            onAdd={() => console.log("Añadir insignia")}
          />

          <ListCard
            type="tramos"
            items={tramosUI}
            onEdit={(id) => console.log("Editar tramo", id)}
            onAdd={() => console.log("Añadir tramo")}
          />
        </div>
      </section>

      {/* Modal clonar */}
      {cloneModalOpen && (
        <ClonarCofradiaModal
          isOpen={cloneModalOpen}
          cofradia={cofradia}
          loading={cloneLoading}
          errorMessage={cloneError}
          onClose={() => setCloneModalOpen(false)}
          onConfirmClone={handleConfirmClone}
        />
      )}

      {/* Modal editar ✅ */}
      {editModalOpen && (
        <EditarCofradiaModal
          isOpen={editModalOpen}
          cofradia={cofradia}
          onClose={() => setEditModalOpen(false)}
          onSuccess={async () => {
            await refetch(); // refresca la data
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
