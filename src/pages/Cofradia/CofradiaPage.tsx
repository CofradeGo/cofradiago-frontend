import React, { useState, useEffect } from "react";
import { useCofradias } from "../../hooks/useCofradias";
import { CofradiaActivaCard } from "../../components/organisms/CofradiaActivaCard";
import { CofradiasHistoricoTable } from "../../components/organisms/CofradiasHistoricoTable";
import { CofradiaPageLayout } from "../../components/layouts/CofradiaPageLayout";
import { getUserFromStorage } from "../../utils/authToken";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { ActionButton } from "../../components/atoms/ActionButton";

export const CofradiaPage: React.FC = () => {
  const { cofradiasActivas, historico, loading, error, refetch, updateCofradia } = useCofradias();
  const [user, setUser] = useState(getUserFromStorage());
  const isDMG = user?.role === "DMG";

  // Paginación activas
  const pageSizeActiva = 2;
  const [currentPageActiva, setCurrentPageActiva] = useState(1);
  const totalPagesActiva = Math.ceil(cofradiasActivas.length / pageSizeActiva);
  const indexLastActiva = currentPageActiva * pageSizeActiva;
  const indexFirstActiva = indexLastActiva - pageSizeActiva;
  const currentCofradiasActiva = cofradiasActivas.slice(indexFirstActiva, indexLastActiva);

  // Paginación histórico
  const pageSizeHistorico = 10;
  const [currentPageHistorico, setCurrentPageHistorico] = useState(1);
  const totalPagesHistorico = Math.ceil(historico.length / pageSizeHistorico);
  const indexLastHistorico = currentPageHistorico * pageSizeHistorico;
  const indexFirstHistorico = indexLastHistorico - pageSizeHistorico;
  const currentCofradiasHistorico = historico.slice(indexFirstHistorico, indexLastHistorico);

  // Escucha cambios en localStorage (logout/login)
  useEffect(() => {
    const handleStorageChange = () => setUser(getUserFromStorage());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (loading) return <p>Cargando cofradías...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    setPage: (page: number) => void,
  ) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-1 mt-3">
        <button
          onClick={() => currentPage > 1 && setPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentPage === i + 1 ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header con botón crear cofradía */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cofradía</h1>
          <p className="text-gray-600">Gestión de la cofradía y sus actividades.</p>
        </div>

        {isDMG && (
          <ActionButton
            label="Crear nueva cofradía"
            onClick={() => console.log("Crear nueva cofradía")}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 shadow-md rounded-md"
          >
            <Plus className="w-4 h-4" />
          </ActionButton>
        )}
      </div>

      <CofradiaPageLayout
        activa={
          <>
            {currentCofradiasActiva.length === 0 ? (
              <p className="text-gray-500">No hay cofradías activas actualmente</p>
            ) : (
              <div className="space-y-4">
                {currentCofradiasActiva.map((c) => (
                  <CofradiaActivaCard
                    key={c.id}
                    cofradia={c}
                    isDMG={!!isDMG}
                    updateCofradia={updateCofradia}
                    onUpdated={refetch}
                  />
                ))}
              </div>
            )}
            {renderPagination(currentPageActiva, totalPagesActiva, setCurrentPageActiva)}
          </>
        }
        historico={
          <>
            {currentCofradiasHistorico.length === 0 ? (
              <p className="text-gray-500">No hay cofradías cerradas</p>
            ) : (
              <CofradiasHistoricoTable cofradias={currentCofradiasHistorico} onUpdated={refetch} />
            )}
            {historico.length > pageSizeHistorico &&
              renderPagination(currentPageHistorico, totalPagesHistorico, setCurrentPageHistorico)}
          </>
        }
      />
    </div>
  );
};
