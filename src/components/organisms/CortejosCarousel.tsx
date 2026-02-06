import React from "react";
import { CortejoCard } from "../molecules/CortejoCard";
import iconPenitente from "../../assets/icons/penitente.png";

interface Cortejo {
  id: number;
  nombre: string;
}

interface Props {
  cortejos: Cortejo[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export const CortejosCarousel: React.FC<Props> = ({
  cortejos,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) => {
  // Todos los cortejos + slot añadir
  const displayItems = [...cortejos, { id: -1, nombre: "" } as Cortejo];

  return (
    <div className="relative">
      <div
        className="flex space-x-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none" }} // Firefox
      >
        {displayItems.map((c) =>
          c.id === -1 ? (
            // Slot añadir cortejo
            <div
              key="add"
              className="flex-shrink-0 w-1/3 h-64 bg-gray-100 rounded-xl shadow-md flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
              style={{ height: "24rem", minWidth: "20rem" }}
            >
              <button onClick={onAdd} className="text-gray-800 font-medium px-4 py-2">
                + Añadir Cortejo
              </button>
            </div>
          ) : (
            <CortejoCard
              key={c.id}
              nombre={c.nombre}
              onView={() => onView(c.id)}
              onEdit={() => onEdit(c.id)}
              onDelete={() => onDelete(c.id)}
              icon={iconPenitente}
              className="flex-shrink-0 w-1/3"
            />
          ),
        )}
      </div>

      {/* Indicador visual de deslizar */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <span className="text-gray-400 text-2xl animate-bounce">›</span>
      </div>
    </div>
  );
};
