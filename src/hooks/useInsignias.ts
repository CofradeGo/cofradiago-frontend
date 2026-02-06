import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import { InsigniaEndpoints } from "../api/api";

export interface Insignia {
  id: number;
  cofradiaId: number;
  nombre: string;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsigniaUI {
  id: number;
  title: string;
}

interface UseInsigniasReturn {
  insignias: Insignia[];
  insigniasUI: InsigniaUI[];
  loading: boolean;
  error: string | null;
  createInsignia: (nombre: string, descripcion?: string) => Promise<void>;
  updateInsignia: (insigniaId: number, nombre: string, descripcion?: string) => Promise<void>;
  deleteInsignia: (insigniaId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useInsignias = (cofradiaId: number): UseInsigniasReturn => {
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const insigniasUI: InsigniaUI[] = insignias.map((i) => ({
    id: i.id,
    title: i.nombre,
  }));

  const fetchInsignias = useCallback(async () => {
    if (!cofradiaId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Insignia[]>(InsigniaEndpoints.list(cofradiaId));
      setInsignias(res.data);
    } catch (err: unknown) {
      console.error("Error al listar insignias:", err);
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido al listar insignias");
    } finally {
      setLoading(false);
    }
  }, [cofradiaId]);

  useEffect(() => {
    fetchInsignias();
  }, [fetchInsignias]);

  const createInsignia = useCallback(
    async (nombre: string, descripcion?: string) => {
      if (!cofradiaId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.post<{ insignia: Insignia }>(
          InsigniaEndpoints.create(cofradiaId),
          { nombre, descripcion },
        );
        setInsignias((prev) => [...prev, res.data.insignia]);
      } catch (err: unknown) {
        console.error("Error al crear insignia:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al crear insignia");
      } finally {
        setLoading(false);
      }
    },
    [cofradiaId],
  );

  const updateInsignia = useCallback(
    async (insigniaId: number, nombre: string, descripcion?: string) => {
      if (!cofradiaId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.put<{ insignia: Insignia }>(
          InsigniaEndpoints.update(cofradiaId, insigniaId),
          { nombre, descripcion },
        );
        setInsignias((prev) => prev.map((i) => (i.id === insigniaId ? res.data.insignia : i)));
      } catch (err: unknown) {
        console.error("Error al actualizar insignia:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al actualizar insignia");
      } finally {
        setLoading(false);
      }
    },
    [cofradiaId],
  );

  const deleteInsignia = useCallback(
    async (insigniaId: number) => {
      if (!cofradiaId) return;
      setLoading(true);
      setError(null);
      try {
        await axiosClient.delete(InsigniaEndpoints.delete(cofradiaId, insigniaId));
        setInsignias((prev) => prev.filter((i) => i.id !== insigniaId));
      } catch (err: unknown) {
        console.error("Error al borrar insignia:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al borrar insignia");
      } finally {
        setLoading(false);
      }
    },
    [cofradiaId],
  );

  return {
    insignias,
    insigniasUI,
    loading,
    error,
    createInsignia,
    updateInsignia,
    deleteInsignia,
    refresh: fetchInsignias,
  };
};
