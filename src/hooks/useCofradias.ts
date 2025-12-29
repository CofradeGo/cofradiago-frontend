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
        axiosClient.get<Cofradia[]>(CofradiaEndpoints.list, {
          params: { estado: "ABIERTA" },
        }),
        axiosClient.get<Cofradia[]>(CofradiaEndpoints.list, {
          params: { estado: "CERRADA", order: "desc" },
        }),
      ]);

      // Guardamos todas las activas en vez de solo la primera
      setCofradiasActivas(activaRes.data);
      setHistorico(historicoRes.data);
    } catch (err) {
      console.error("Error cargando cofradías", err);
      setError("No se pudieron cargar las cofradías");
    } finally {
      setLoading(false);
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
  };
};
