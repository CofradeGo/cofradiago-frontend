import type { Cofradia } from "../../types/Cofradia";
import { CofradiaInfo } from "../molecules/CofradiaInfo";
import { EmptyState } from "../atoms/EmptyState";
import { ActionButton } from "../atoms/ActionButton";
import { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { ClonarCofradiaModal } from "./ClonarCofradiaModal";

interface Props {
  cofradia: Cofradia | null;
  isDMG: boolean;
  updateCofradia: (id: number, data: Partial<Cofradia>) => Promise<Cofradia>;
  clonarCofradia: (cofradiaId: number, anioNuevo: number) => Promise<Cofradia>;
  onUpdated: () => void;
}

export const CofradiaActivaCard: React.FC<Props> = ({
  cofradia,
  isDMG,
  updateCofradia,
  clonarCofradia,
  onUpdated,
}) => {
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
    try {
      await updateCofradia(cofradia.id, { estado: "CERRADA" });
      onUpdated();
      setModalCerrarOpen(false);
    } catch (err) {
      console.error("Error cerrando cofradía:", err);
      alert("Hubo un error al cerrar la cofradía. Inténtalo de nuevo.");
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
        <ActionButton
          label="Ver Cortejos"
          onClick={() => console.log("Ver cortejos", cofradia.id)}
        />
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
            <p className="mb-6 text-gray-700">
              Piensa bien: una vez cerrada, la cofradía no podrá modificarse ni reabrirse.
            </p>
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
