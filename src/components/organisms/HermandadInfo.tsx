import React from "react";
import { FiMail, FiEdit, FiImage } from "react-icons/fi";
import type { Hermandad } from "../../types/Hermandad";

interface HermandadInfoProps {
  domain: string;
  hermandad: Hermandad;
  openEditModal: () => void;
}

export const HermandadInfo: React.FC<HermandadInfoProps> = ({ hermandad, openEditModal }) => {
  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-2xl p-8 max-w-6xl mx-auto gap-10">
      {/* Logo */}
      <div className="w-48 h-48 md:w-56 md:h-56 flex-shrink-0 rounded-full overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
        {hermandad.logoUrl ? (
          <img
            src={hermandad.logoUrl}
            alt={`${hermandad.name} logo`}
            className="object-cover w-full h-full"
          />
        ) : (
          <FiImage className="text-gray-300 w-16 h-16" />
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col h-full">
        {/* Datos principales */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-gray-900 leading-tight break-words">
            {hermandad.name}
          </h2>

          {hermandad.officialEmail && (
            <div className="flex items-center gap-3 text-gray-700 text-lg">
              <FiMail className="w-6 h-6 text-gray-500" />
              <span>{hermandad.officialEmail}</span>
            </div>
          )}
        </div>

        {/* Footer con botón siempre al final */}
        <div className="mt-auto flex justify-end">
          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-lg shadow-md transition-all duration-200 text-sm font-medium"
          >
            <FiEdit className="w-4 h-4" />
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};
