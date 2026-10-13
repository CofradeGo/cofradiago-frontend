import type { Cofradia } from "../../types/Cofradia";
import { CofradiaInfo } from "../molecules/CofradiaInfo";
import { EmptyState } from "../atoms/EmptyState";
import { ActionButton } from "../atoms/ActionButton";
import { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ClonarCofradiaModal } from "./ClonarCofradiaModal";

interface Props {
  cofradia: Cofradia | null;
  isDMG: boolean;
  clonarCofradia: (cofradiaId: number, anioNuevo: number) => Promise<Cofradia>;
  cambiarEstadoCofradia: (cofradiaId: number, estado: "ABIERTA" | "CERRADA") => Promise<Cofradia>;
  onUpdated: () => void;
}

export const CofradiaActivaCard: React.FC<Props> = ({
  cofradia,
  isDMG,
  clonarCofradia,
  cambiarEstadoCofradia,
  onUpdated,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalCerrarOpen, setModalCerrarOpen] = useState(false);
  const [modalClonarOpen, setModalClonarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si clicas fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!cofradia) return <EmptyState message="No hay ninguna cofradía activa actualmente" />;

  const handleMenuAction = (action: string) => {
    setMenuOpen(false);
    if (action === "Cerrar") setModalCerrarOpen(true);
    if (action === "Clonar") {
      setModalClonarOpen(true);
      setErrorMessage("");
    }
  };

  const handleCloseCofradia = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      await cambiarEstadoCofradia(cofradia.id, "CERRADA");
      onUpdated();
      setModalCerrarOpen(false);
    } catch (err) {
      // El mensaje real viene del backend. Con un alert genérico se
      // perdía: no había forma de saber si fallaba por permisos, por
      // la cofradía o por otra cosa.
      setErrorMessage(err instanceof Error ? err.message : "No se ha podido cerrar la cofradía");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClone = async ({ anio }: { nombre: string; anio: number }) => {
    setLoading(true);
    setErrorMessage("");
    try {
      // ✅ Usamos la función del hook, nada de POST directo
      await clonarCofradia(cofradia.id, anio);
      onUpdated();
      setModalClonarOpen(false);
    } catch (err: unknown) {
      console.error("Error clonando la cofradía:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Error desconocido al clonar la cofradía",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded shadow-sm bg-white relative">
      <CofradiaInfo cofradia={cofradia} />

      <div className="mt-4 flex items-center justify-between">
        <ActionButton label="Ver Cortejos" onClick={() => navigate(`${cofradia.id}/cortejos`)} />
        {isDMG && (
          <div className="relative" ref={menuRef}>
            <button
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => setMenuOpen((p) => !p)}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <Link
                  to={`${cofradia.id}/gestionar`}
                  className="w-full text-left block px-4 py-2 hover:bg-gray-100"
                >
                  Gestionar
                </Link>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Editar</button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleMenuAction("Clonar")}
                >
                  Clonar
                </button>
                <hr className="my-1 border-gray-200" />
                <button
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                  onClick={() => handleMenuAction("Cerrar")}
                >
                  Cerrar cofradía
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {modalCerrarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Cerrar Cofradía</h2>
            <p className="mb-4 text-gray-700">
              Al cerrarla deja de admitir cambios: no se podrán crear cortejos, ni añadir hermanos a
              los puestos, ni reordenar nada. Puedes volver a abrirla más adelante desde el
              histórico.
            </p>

            {errorMessage && (
              <p
                role="alert"
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {errorMessage}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-100"
                onClick={() => setModalCerrarOpen(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleCloseCofradia}
                disabled={loading}
              >
                {loading ? "Cerrando..." : "Sí, cerrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalClonarOpen && (
        <ClonarCofradiaModal
          isOpen={modalClonarOpen}
          cofradia={cofradia}
          errorMessage={errorMessage}
          loading={loading}
          onClose={() => setModalClonarOpen(false)}
          onConfirmClone={handleConfirmClone}
        />
      )}
    </div>
  );
};
