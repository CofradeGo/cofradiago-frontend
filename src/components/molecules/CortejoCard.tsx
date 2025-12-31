import React from "react";

interface Props {
  nombre: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  icon: string; // ruta del icono
  className?: string;
}

export const CortejoCard: React.FC<Props> = ({
  nombre,
  onView,
  onEdit,
  onDelete,
  icon,
  className,
}) => {
  return (
    <div
      className={`flex flex-col justify-between items-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 ${className}`}
      style={{ height: "24rem", minWidth: "20rem" }}
    >
      {/* Nombre del cortejo */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{nombre}</h3>

      {/* Icono centrado */}
      <img src={icon} alt="Cortejo" className="my-auto w-24 h-24 object-contain" />

      {/* Botones abajo, inline */}
      <div className="flex space-x-3 mt-6 w-full justify-center">
        <button
          onClick={onView}
          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-sm"
        >
          Ver
        </button>
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200 font-semibold shadow-sm"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors duration-200 font-semibold shadow-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
