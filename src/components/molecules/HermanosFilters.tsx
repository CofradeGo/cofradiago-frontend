import React from "react";
import type { HermanosFiltersState } from "../../hooks/useHermanos";

export interface HermanosFiltersProps {
  filters: HermanosFiltersState;
  onChange: React.Dispatch<React.SetStateAction<HermanosFiltersState>>;
}

export const HermanosFilters: React.FC<HermanosFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 md:flex-row md:items-end">
      {/* Buscar por nombre / apellidos */}
      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
        <input
          type="text"
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              search: e.target.value || undefined,
            }))
          }
          placeholder="Nombre o apellidos"
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Dirección */}
      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-sm font-medium text-gray-700 mb-1">Dirección</label>
        <input
          type="text"
          value={filters.direccion ?? ""}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              direccion: e.target.value || undefined,
            }))
          }
          placeholder="Calle, plaza..."
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Rango de edad */}
      <div className="flex gap-2 w-full md:w-1/3">
        <div className="flex flex-col w-1/2">
          <label className="text-sm font-medium text-gray-700 mb-1">Edad mínima</label>
          <input
            type="number"
            min={0}
            value={filters.edadMin ?? ""}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                edadMin: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col w-1/2">
          <label className="text-sm font-medium text-gray-700 mb-1">Edad máxima</label>
          <input
            type="number"
            min={0}
            value={filters.edadMax ?? ""}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                edadMax: e.target.value ? Number(e.target.value) : undefined,
              }))
            }
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
