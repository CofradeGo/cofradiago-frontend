import React from "react";
import type { HermanoListado } from "../../types/Hermano";
import { HermanoRow } from "./HermanoRow";
import { Users } from "lucide-react";

interface HermanosListProps {
  hermanos: HermanoListado[];
  loading: boolean;
  error?: string | null;
  onRowClick?: (hermano: HermanoListado) => void;
}

export const HermanosList: React.FC<HermanosListProps> = ({
  hermanos,
  loading,
  error,
  onRowClick,
}) => {
  // -------------------------
  // Loading
  // -------------------------
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        {/* Header skeleton */}
        <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 bg-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        {/* Rows skeleton */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-4 py-4 border-b animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // -------------------------
  // Error
  // -------------------------
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow">
        <Users className="w-10 h-10 text-red-400 mb-3" />
        <p className="text-gray-600 font-medium">{error}</p>
      </div>
    );
  }

  // -------------------------
  // Empty
  // -------------------------
  if (!hermanos || hermanos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl shadow">
        <Users className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No hay hermanos que coincidan con los filtros</p>
      </div>
    );
  }

  // -------------------------
  // List (tabla / lista)
  // -------------------------
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {/* Header (solo desktop) */}
      <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-3 bg-gray-100 text-sm font-semibold text-gray-700">
        <div>Nº</div>
        <div className="col-span-2">Nombre</div>
        <div>Teléfono</div>
        <div>Email</div>
        <div>Dirección</div>
      </div>

      {/* Rows */}
      {hermanos.map((hermano) => (
        <div
          key={hermano.numeroAntiguedad}
          onClick={() => onRowClick?.(hermano)}
          className={onRowClick ? "cursor-pointer" : ""}
        >
          <HermanoRow hermano={hermano} />
        </div>
      ))}
    </div>
  );
};
