import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { CofradiaEndpoints } from "../api/api";
import type { Cofradia, CrearCofradiaFullInput } from "../types/Cofradia";
import { isAxiosError } from "axios";

export const useCofradias = () => {
  const [cofradiasActivas, setCofradiasActivas] = useState<Cofradia[]>([]);
  const [historico, setHistorico] = useState<Cofradia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cloning, setCloning] = useState(false);
  const [cloneError, setCloneError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // ===================== Fetch =====================
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

  // ===================== Update =====================
  const updateCofradia = async (cofradiaId: number, data: Partial<Cofradia>) => {
    try {
      const res = await axiosClient.put(CofradiaEndpoints.update(cofradiaId), data);

      if (data.estado === "CERRADA") {
        setCofradiasActivas((prev) => prev.filter((c) => c.id !== cofradiaId));
        setHistorico((prev) => [res.data.cofradia, ...prev]);
      } else {
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

  // ===================== Clone =====================
  const clonarCofradia = async (cofradiaId: number, anioNuevo: number) => {
    try {
      setCloning(true);
      setCloneError(null);

      const res = await axiosClient.post<{ cofradia: Cofradia }>(
        CofradiaEndpoints.clone(cofradiaId),
        { anioNuevo },
      );

      await fetchCofradias();

      return res.data.cofradia;
    } catch (err: unknown) {
      console.error("Error clonando cofradía", err);

      if (isAxiosError(err)) {
        setCloneError(err.response?.data?.message || "Error al clonar la cofradía");
      } else {
        setCloneError("Error desconocido al clonar la cofradía");
      }

      throw err;
    } finally {
      setCloning(false);
    }
  };

  // ===================== Create Full =====================
  const createFullCofradia = async (data: CrearCofradiaFullInput) => {
    try {
      setCreating(true);
      setCreateError(null);

      const res = await axiosClient.post<{ cofradia: Cofradia }>(
        CofradiaEndpoints.createFull,
        data,
      );

      await fetchCofradias();

      return res.data.cofradia;
    } catch (err: unknown) {
      console.error("Error creando cofradía full", err);

      if (isAxiosError(err)) {
        setCreateError(err.response?.data?.message || "Error al crear la cofradía");
      } else {
        setCreateError("Error desconocido al crear la cofradía");
      }

      throw err;
    } finally {
      setCreating(false);
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
    creating,
    createError,
    clonarCofradia,
    createFullCofradia,
    refetch: fetchCofradias,
    updateCofradia,
  };
};
