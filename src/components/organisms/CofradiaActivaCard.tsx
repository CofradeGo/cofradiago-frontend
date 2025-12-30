import type { Cofradia } from "../../types/Cofradia";
import { CofradiaInfo } from "../molecules/CofradiaInfo";
import { EmptyState } from "../atoms/EmptyState";
import { ActionButton } from "../atoms/ActionButton";
import { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";

interface Props {
  cofradia: Cofradia | null;
  isDMG: boolean;
}

export const CofradiaActivaCard = ({ cofradia, isDMG }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cierra el submenú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!cofradia) {
    return <EmptyState message="No hay ninguna cofradía activa actualmente" />;
  }

  const handleMenuAction = (action: string) => {
    console.log(action, cofradia.id);
    setMenuOpen(false); // Cierra el menú al seleccionar una acción
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
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleMenuAction("Gestionar")}
                >
                  Gestionar
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleMenuAction("Editar")}
                >
                  Editar
                </button>
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
    </div>
  );
};
