import React from "react";
import { type Cofradia } from "../../types/Cofradia";

interface Props {
  cofradia: Cofradia;
  onEdit: () => void;
  onDelete: () => void;
  onClone: () => void;
}

export const CofradiaHeader: React.FC<Props> = ({ cofradia, onEdit, onDelete, onClone }) => {
  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-xl shadow-md border border-gray-200">
      {/* Info de la cofradía */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{cofradia.nombre}</h1>
        <p className="text-2xl text-gray-600 font-semibold mt-1">Año: {cofradia.anio}</p>
        <span className="inline-block mt-2 px-3 py-1 text-sm font-medium text-gray-500 bg-gray-100 rounded-full">
          {cofradia.tipo}
        </span>
      </div>

      {/* Botones */}
      <div className="flex space-x-3">
        <button
          onClick={onEdit}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
        >
          Editar
        </button>
        <button
          onClick={onDelete}
          className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition-colors duration-200"
        >
          Eliminar
        </button>
        <button
          onClick={onClone}
          className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-300 transition-colors duration-200"
        >
          Clonar
        </button>
      </div>
    </div>
  );
};
