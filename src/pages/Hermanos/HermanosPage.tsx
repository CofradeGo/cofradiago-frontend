import React from "react";
import { HermanosList } from "../../components/organisms/HermanosList";
import { HermanosFilters } from "../../components/molecules/HermanosFilters";
import { useHermanos } from "../../hooks/useHermanos";

export const HermanosPage: React.FC = () => {
  const { hermanos, total, page, limit, loading, error, filters, setFilters, setPage } =
    useHermanos();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hermanos</h1>
        <p className="text-gray-600 mt-1">Listado y gestión de los hermanos de la hermandad</p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <HermanosFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Listado */}
      <HermanosList hermanos={hermanos} loading={loading} error={error} />

      {/* Paginación */}
      {!loading && total > limit && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white shadow text-sm font-medium disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="text-sm text-gray-600">
            Página {page} de {Math.ceil(total / limit)}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(total / limit)}
            className="px-4 py-2 rounded-lg bg-white shadow text-sm font-medium disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};
