import type { Cofradia } from "../../types/Cofradia";
import { useState, useRef, useEffect } from "react";
import { getUserFromStorage } from "../../utils/authToken";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

interface Props {
  cofradias: Cofradia[];
}

export const CofradiasHistoricoTable = ({ cofradias }: Props) => {
  const user = getUserFromStorage();
  const isDMG = user?.role === "DMG";

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!Object.values(buttonRefs.current).some((b) => b?.contains(target))) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  if (cofradias.length === 0) {
    return <p className="text-gray-500">No hay cofradías cerradas.</p>;
  }

  const handleMenuOpen = (id: number) => {
    const btn = buttonRefs.current[id];
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    setMenuCoords({ top: rect.bottom + window.scrollY, left: rect.right - 128 }); // ancho menú 128px
    setOpenMenuId(openMenuId === id ? null : id);
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
                  {/* Botón de tres puntitos */}
                  <button
                    className="p-1 rounded hover:bg-gray-100"
                    ref={(el: HTMLButtonElement | null) => {
                      buttonRefs.current[c.id] = el;
                    }}
                    onClick={() => handleMenuOpen(c.id)}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {/* Submenú con portal */}
                  {openMenuId === c.id &&
                    createPortal(
                      <div
                        style={{ top: menuCoords.top, left: menuCoords.left }}
                        className="absolute w-32 bg-white border rounded shadow-lg z-[9999]"
                      >
                        {/* Ver detalle visible para todos */}
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            console.log("Ver detalle", c.id);
                            setOpenMenuId(null);
                          }}
                        >
                          Ver detalle
                        </button>

                        {/* Clonar solo para DMG */}
                        {isDMG && (
                          <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                              console.log("Clonar cofradía", c.id);
                              setOpenMenuId(null);
                            }}
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
    </div>
  );
};
