import { useState } from "react";
import { HermanosFilters } from "../molecules/HermanosFilters";
import { HermanosList } from "./HermanosList";
import { PapeletaSitioPlaceholder } from "../molecules/PapeletaSitioPlaceholder";
import { useHermanos } from "../../hooks/useHermanos";

export const HermanosTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"listado" | "papeleta">("listado");

  // Hook de hermanos (filtros, paginación, etc.)
  const { hermanos, total, page, limit, loading, error, filters, setFilters, setPage } =
    useHermanos();

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow">
      {/* Pestañas */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "listado"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("listado")}
        >
          Listado
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "papeleta"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("papeleta")}
        >
          Papeleta de sitio
        </button>
      </div>

      {/* Contenido de la pestaña */}
      <div>
        {activeTab === "listado" && (
          <>
            {/* Filtros */}
            <div className="mb-6">
              <HermanosFilters filters={filters} onChange={setFilters} />
            </div>

            {/* Listado de hermanos */}
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
          </>
        )}

        {activeTab === "papeleta" && <PapeletaSitioPlaceholder />}
      </div>
    </div>
  );
};
