import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { CofradiaEndpoints } from "../api/api";
import type { Cofradia } from "../types/Cofradia";
import { isAxiosError } from "axios";

export const useCofradias = () => {
  const [cofradiasActivas, setCofradiasActivas] = useState<Cofradia[]>([]);
  const [historico, setHistorico] = useState<Cofradia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cloning, setCloning] = useState(false);
  const [cloneError, setCloneError] = useState<string | null>(null);

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

  // Nueva función para clonar cofradía usando el endpoint de clonación
  const clonarCofradia = async (cofradiaId: number, anioNuevo: number) => {
    try {
      setCloning(true);
      setCloneError(null);

      // ✅ POST al endpoint de clonación
      const res = await axiosClient.post<{ cofradia: Cofradia }>(
        CofradiaEndpoints.clone(cofradiaId),
        { anioNuevo },
      );

      // ✅ Añadir la nueva cofradía al listado de activas
      setCofradiasActivas((prev) => [res.data.cofradia, ...prev]);

      return res.data.cofradia;
    } catch (err: unknown) {
      console.error("Error clonando cofradía", err);

      if (isAxiosError(err)) {
        setCloneError(err.response?.data?.message || "Error desconocido al clonar la cofradía");
      } else {
        setCloneError("Error desconocido al clonar la cofradía");
      }

      throw err;
    } finally {
      setCloning(false);
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
    cloning,
    cloneError,
    clonarCofradia,
    refetch: fetchCofradias,
    updateCofradia,
  };
};
