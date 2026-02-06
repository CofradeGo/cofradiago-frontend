import type { Cofradia } from "../../types/Cofradia";
import { useState, useRef, useEffect } from "react";
import { getUserFromStorage } from "../../utils/authToken";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { ClonarCofradiaModal } from "../organisms/ClonarCofradiaModal";

interface Props {
  cofradias: Cofradia[];
  onUpdated: () => void;
  clonarCofradia: (id: number, anio: number) => Promise<Cofradia>; // 🔹 recibe la función por props
}

export const CofradiasHistoricoTable: React.FC<Props> = ({
  cofradias,
  onUpdated,
  clonarCofradia,
}) => {
  const user = getUserFromStorage();
  const isDMG = user?.role === "DMG";

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCofradia, setSelectedCofradia] = useState<Cofradia | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!Object.values(buttonRefs.current).some((b) => b?.contains(target))) setOpenMenuId(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  if (cofradias.length === 0) return <p className="text-gray-500">No hay cofradías cerradas.</p>;

  const handleMenuOpen = (id: number) => {
    const btn = buttonRefs.current[id];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuCoords({ top: rect.bottom + window.scrollY, left: rect.right - 128 });
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleOpenCloneModal = (cofradia: Cofradia) => {
    setSelectedCofradia(cofradia);
    setModalOpen(true);
    setErrorMessage("");
    setOpenMenuId(null);
  };

  const handleConfirmClone = async ({ anio }: { nombre: string; anio: number }) => {
    if (!selectedCofradia) return;
    setLoading(true);
    setErrorMessage("");
    try {
      // 🔹 Clonar usando la función pasada por props
      await clonarCofradia(selectedCofradia.id, anio);

      setModalOpen(false);
      setSelectedCofradia(null);
      onUpdated();
    } catch (err: unknown) {
      console.error("Error al clonar la cofradía:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Error desconocido al clonar la cofradía.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto relative">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Año</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cofradias.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.anio}</td>
              <td className="p-2">{c.nombre}</td>
              <td className="p-2 relative">
                <div className="inline-block ml-2 relative">
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    ref={(el) => {
                      buttonRefs.current[c.id] = el ?? null;
                    }}
                    onClick={() => handleMenuOpen(c.id)}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  {openMenuId === c.id &&
                    createPortal(
                      <div
                        style={{ top: menuCoords.top, left: menuCoords.left }}
                        className="absolute w-32 bg-white border rounded shadow-lg z-[9999]"
                      >
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => setOpenMenuId(null)}
                        >
                          Ver detalle
                        </button>
                        {isDMG && (
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleOpenCloneModal(c)}
                          >
                            Clonar
                          </button>
                        )}
                      </div>,
                      document.body,
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCofradia && (
        <ClonarCofradiaModal
          isOpen={modalOpen}
          cofradia={selectedCofradia}
          errorMessage={errorMessage}
          loading={loading}
          onClose={() => {
            setModalOpen(false);
            setSelectedCofradia(null);
            setErrorMessage("");
          }}
          onConfirmClone={handleConfirmClone}
        />
      )}
    </div>
  );
};
