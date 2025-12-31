import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import { CortejoEndpoints } from "../api/api";
import { isAxiosError } from "axios";

export interface Cortejo {
  id: number;
  nombre: string;
  orden: number;
  cofradiaId: number;
}

interface UseCortejosReturn {
  cortejos: Cortejo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  crearCortejo: (nombre: string, orden: number) => Promise<Cortejo | null>;
  editarCortejo: (id: number, nombre?: string, orden?: number) => Promise<Cortejo | null>;
  borrarCortejo: (id: number) => Promise<boolean>;
}

export const useCortejos = (cofradiaId: number): UseCortejosReturn => {
  const [cortejos, setCortejos] = useState<Cortejo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCortejos = useCallback(async () => {
    if (!cofradiaId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.get<Cortejo[]>(CortejoEndpoints.listByCofradia(cofradiaId));
      setCortejos(res.data);
    } catch (err: unknown) {
      console.error("Error cargando cortejos:", err);
      setError("No se pudieron cargar los cortejos");
    } finally {
      setLoading(false);
    }
  }, [cofradiaId]);

  const crearCortejo = async (nombre: string, orden: number): Promise<Cortejo | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.post<{ cortejo: Cortejo }>(
        CortejoEndpoints.create(cofradiaId),
        { nombre, orden },
      );

      setCortejos((prev) => [...prev, res.data.cortejo]);
      return res.data.cortejo;
    } catch (err: unknown) {
      console.error("Error creando cortejo:", err);

      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Error desconocido al crear cortejo");
      } else {
        setError("Error desconocido al crear cortejo");
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  const editarCortejo = async (
    id: number,
    nombre?: string,
    orden?: number,
  ): Promise<Cortejo | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.put<{ cortejo: Cortejo }>(CortejoEndpoints.update(id), {
        nombre,
        orden,
      });

      setCortejos((prev) => prev.map((c) => (c.id === id ? res.data.cortejo : c)));

      return res.data.cortejo;
    } catch (err: unknown) {
      console.error("Error editando cortejo:", err);

      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Error desconocido al editar cortejo");
      } else {
        setError("Error desconocido al editar cortejo");
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  const borrarCortejo = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await axiosClient.delete(CortejoEndpoints.delete(id));
      setCortejos((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err: unknown) {
      console.error("Error borrando cortejo:", err);

      if (isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Error desconocido al borrar cortejo");
      } else {
        setError("Error desconocido al borrar cortejo");
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCortejos();
  }, [fetchCortejos]);

  return {
    cortejos,
    loading,
    error,
    refetch: fetchCortejos,
    crearCortejo,
    editarCortejo,
    borrarCortejo,
  };
};
