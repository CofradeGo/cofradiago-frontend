import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCofradias } from "../../hooks/useCofradias";
import { CofradiaHeader } from "../../components/molecules/CofradiaHeader";
import { ClonarCofradiaModal } from "../../components/organisms/ClonarCofradiaModal";
import { EditarCofradiaModal } from "../../components/organisms/EditarCofradiaModal"; // ✅ nuevo
import { useCortejos } from "../../hooks/useCortejos";
import { useCargos } from "../../hooks/useCargo";
import { ListCard } from "../../components/organisms/ListCard";
import { ToastProvider } from "../../components/organisms/toast/ToastProvider";
import { GestionCortejos } from "../../components/organisms/GestionCortejos";
import { GestionPuestos } from "../../components/organisms/GestionPuestos";
import { GestionInsignias } from "../../components/organisms/GestionInsignias";
import { GestionTramos } from "../../components/organisms/GestionTramos";
import type { Cofradia } from "../../types/Cofradia";
import { ROUTES } from "../../routes/routes";
import { getDomain } from "../../utils/domain"; // helper
import { getUserFromStorage } from "../../utils/authToken";

export const GestionCofradiaPage: React.FC = () => {
  const { cofradiaId, domain: domainParam } = useParams<{ cofradiaId: string; domain: string }>();
  const navigate = useNavigate();
  // El AUXILIAR entra en modo lectura: sin acciones de edición.
  const esDMG = getUserFromStorage()?.role === "DMG";

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
  // Cortejos y puestos gestionan su propia tabla y modales. Aquí solo
  // se necesitan los cargos y tramos, que aún usan el listado simple.
  // Los cortejos se piden también en esta pantalla porque los tramos
  // cuelgan de un cortejo concreto.
  const { cortejos } = useCortejos(cofradia?.id || 0);
  const { cargosUI, loading: loadingCargos, error: errorCargos } = useCargos(cofradia?.id || 0);
  // Los tramos cuelgan de un cortejo, así que la página recuerda cuál
  // está abierto. Antes se usaba siempre el primero, sin poder elegir.
  const [cortejoSeleccionado, setCortejoSeleccionado] = useState(0);
  useEffect(() => {
    if (cortejoSeleccionado === 0 && cortejos.length > 0) {
      setCortejoSeleccionado(cortejos[0].id);
    }
  }, [cortejos, cortejoSeleccionado]);

  // ===================== Guards =====================
  if (loading) return <p>Cargando cofradía...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!cofradia) return <p className="text-gray-600">Cofradía no encontrada</p>;

  // ===================== Handlers Cofradía =====================
  const handleEditCofradia = () => setEditModalOpen(true); // abre modal editar

  const handleDeleteCofradia = () => {
    // TODO: implementar borrado de cofradía (pedir confirmación antes)
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
    <ToastProvider>
      <div className="space-y-6">
        <CofradiaHeader
          cofradia={cofradia}
          onEdit={handleEditCofradia}
          onDelete={handleDeleteCofradia}
          onClone={handleOpenClone}
        />

        {/* Cortejos */}
        <GestionCortejos cofradiaId={cofradia.id} />

        {/* Puestos */}
        <GestionPuestos cofradiaId={cofradia.id} />

        {/* Cargos (pendiente de migrar a tabla) */}
        {loadingCargos ? (
          <p className="text-sm text-gray-500">Cargando cargos...</p>
        ) : errorCargos ? (
          <p className="text-sm text-red-600">{errorCargos}</p>
        ) : (
          <ListCard
            type="cargos"
            items={cargosUI}
            descripcion="Oficios de la hermandad dentro de la junta directiva."
            onEdit={
              esDMG
                ? () => {
                    // TODO: implementar "Editar cargo"
                  }
                : undefined
            }
            onAdd={
              esDMG
                ? () => {
                    // TODO: implementar "Añadir cargo"
                  }
                : undefined
            }
          />
        )}

        {/* Insignias */}
        <GestionInsignias cofradiaId={cofradia.id} cortejos={cortejos} />

        {/* Tramos */}
        <GestionTramos
          cofradiaId={cofradia.id}
          cortejos={cortejos}
          cortejoSeleccionado={cortejoSeleccionado}
          onCambiarCortejo={setCortejoSeleccionado}
        />

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

        {/* Modal editar */}
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
    </ToastProvider>
  );
};
