import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { CofradiaEndpoints } from "../api/api";
import type { Cofradia } from "../types/Cofradia";

export const useCofradias = () => {
  const [cofradiasActivas, setCofradiasActivas] = useState<Cofradia[]>([]);
  const [historico, setHistorico] = useState<Cofradia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCofradias = async () => {
    try {
      setLoading(true);
      setError(null);

      const [activaRes, historicoRes] = await Promise.all([
        axiosClient.get<Cofradia[]>(CofradiaEndpoints.list, { params: { estado: "ABIERTA" } }),
        axiosClient.get<Cofradia[]>(CofradiaEndpoints.list, {
          params: { estado: "CERRADA", order: "desc" },
        }),
      ]);

      setCofradiasActivas(activaRes.data);
      setHistorico(historicoRes.data);
    } catch (err) {
      console.error("Error cargando cofradías", err);
      setError("No se pudieron cargar las cofradías");
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar cualquier cofradía (editar o cerrar)
  const updateCofradia = async (cofradiaId: number, data: Partial<Cofradia>) => {
    try {
      const res = await axiosClient.put(CofradiaEndpoints.update(cofradiaId), data);

      // Actualizar estado local según el estado de la cofradía
      if (data.estado === "CERRADA") {
        // Pasar de activas a histórico
        setCofradiasActivas((prev) => prev.filter((c) => c.id !== cofradiaId));
        setHistorico((prev) => [res.data.cofradia, ...prev]);
      } else {
        // Editar datos de cofradía en el array correspondiente
        setCofradiasActivas((prev) =>
          prev.map((c) => (c.id === cofradiaId ? res.data.cofradia : c)),
        );
        setHistorico((prev) => prev.map((c) => (c.id === cofradiaId ? res.data.cofradia : c)));
      }

      return res.data.cofradia;
    } catch (err) {
      console.error("Error actualizando cofradía", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCofradias();
  }, []);

  return {
    cofradiasActivas,
    historico,
    loading,
    error,
    refetch: fetchCofradias,
    updateCofradia,
  };
};
