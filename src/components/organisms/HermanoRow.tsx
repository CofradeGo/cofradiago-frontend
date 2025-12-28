import React from "react";
import type { HermanoListado } from "../../types/Hermano";

interface HermanoRowProps {
  hermano: HermanoListado;
}

export const HermanoRow: React.FC<HermanoRowProps> = ({ hermano }) => {
  return (
    <div
      className="
        grid grid-cols-1 gap-3
        px-4 py-4
        border-b
        hover:bg-gray-50 transition
        md:grid-cols-6 md:gap-4
      "
    >
      {/* Nº Antigüedad */}
      <div className="md:col-span-1">
        <span className="md:hidden text-xs text-gray-500">Nº antigüedad</span>
        <div className="font-semibold text-gray-800">{hermano.numeroAntiguedad}</div>
      </div>

      {/* Nombre */}
      <div className="md:col-span-2">
        <span className="md:hidden text-xs text-gray-500">Nombre</span>
        <div className="font-medium text-gray-900">
          {hermano.nombre} {hermano.apellidos}
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <span className="md:hidden text-xs text-gray-500">Teléfono</span>
        <div className="text-gray-700">{hermano.telefono}</div>
      </div>

      {/* Email */}
      <div className="truncate">
        <span className="md:hidden text-xs text-gray-500">Email</span>
        <div className="text-gray-700 truncate">{hermano.email}</div>
      </div>

      {/* Dirección */}
      <div className="truncate">
        <span className="md:hidden text-xs text-gray-500">Dirección</span>
        <div className="text-gray-600 truncate">{hermano.direccion}</div>
      </div>
    </div>
  );
};
