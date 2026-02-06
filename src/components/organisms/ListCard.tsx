import React from "react";

type ListCardType = "puestos" | "cargos" | "insignias" | "tramos";

export interface ListItemUI {
  id: number;
  title: string;
  subtitle?: string; // Aquí pondremos los elementos si es insignia
}

interface Props {
  type: ListCardType;
  items: ListItemUI[];
  onAdd: () => void;
  onEdit?: (id: number) => void; // opcional
}

const typeConfig: Record<ListCardType, { label: string; buttonClasses: string }> = {
  puestos: {
    label: "Puestos",
    buttonClasses:
      "px-4 py-2 text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow hover:from-blue-600 hover:to-blue-700 transition-all",
  },
  cargos: {
    label: "Cargos",
    buttonClasses:
      "px-4 py-2 text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow hover:from-green-600 hover:to-green-700 transition-all",
  },
  insignias: {
    label: "Insignias",
    buttonClasses:
      "px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow hover:from-purple-600 hover:to-purple-700 transition-all",
  },
  tramos: {
    label: "Tramos",
    buttonClasses:
      "px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow hover:from-purple-600 hover:to-purple-700 transition-all",
  },
};

export const ListCard: React.FC<Props> = ({ type, items, onAdd, onEdit }) => {
  const { label, buttonClasses } = typeConfig[type];
  const hasItems = items.length > 0;
  const enableScroll = items.length > 5;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col h-full transition-transform hover:-translate-y-1 hover:shadow-2xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{label}</h3>
          <span className="text-sm text-gray-500">{items.length} registrados</span>
        </div>

        <button onClick={onAdd} className={buttonClasses}>
          + Añadir
        </button>
      </div>

      {/* Listado */}
      {!hasItems ? (
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400 italic">
          No hay {label.toLowerCase()} creados todavía.
        </div>
      ) : (
        <div className={`space-y-3 ${enableScroll ? "overflow-y-auto max-h-[300px]" : ""}`}>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>

                {/* Renderizamos subtitle con saltos de línea si existen */}
                {item.subtitle && (
                  <p className="text-xs text-gray-500 whitespace-pre-line">{item.subtitle}</p>
                )}
              </div>

              {onEdit && (
                <button
                  onClick={() => onEdit(item.id)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Editar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
