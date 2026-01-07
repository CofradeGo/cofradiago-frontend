import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import { ElementoInsigniaEndpoints } from "../api/api";

export interface ElementoInsignia {
  id: number;
  insigniaId: number;
  tipo: string;
  cantidad: number;
  createdAt: string;
  updatedAt: string;
}

export interface ElementoInsigniaUI {
  id: number;
  title: string;
}

interface UseElementoInsigniaReturn {
  elementos: ElementoInsignia[];
  elementosUI: ElementoInsigniaUI[];
  loading: boolean;
  error: string | null;
  createElemento: (tipo: string, cantidad?: number) => Promise<void>;
  updateElemento: (elementoId: number, tipo: string, cantidad?: number) => Promise<void>;
  deleteElemento: (elementoId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useElementoInsignia = (insigniaId: number): UseElementoInsigniaReturn => {
  const [elementos, setElementos] = useState<ElementoInsignia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const elementosUI: ElementoInsigniaUI[] = elementos.map((e) => ({
    id: e.id,
    title: `${e.tipo} (${e.cantidad})`,
  }));

  const fetchElementos = useCallback(async () => {
    if (!insigniaId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<ElementoInsignia[]>(
        ElementoInsigniaEndpoints.list(insigniaId),
      );
      setElementos(res.data);
    } catch (err: unknown) {
      console.error("Error al listar elementos:", err);
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido al listar elementos");
    } finally {
      setLoading(false);
    }
  }, [insigniaId]);

  useEffect(() => {
    fetchElementos();
  }, [fetchElementos]);

  const createElemento = useCallback(
    async (tipo: string, cantidad?: number) => {
      if (!insigniaId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.post<{ elemento: ElementoInsignia }>(
          ElementoInsigniaEndpoints.create(insigniaId),
          { tipo, cantidad },
        );
        setElementos((prev) => [...prev, res.data.elemento]);
      } catch (err: unknown) {
        console.error("Error al crear elemento:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al crear elemento");
      } finally {
        setLoading(false);
      }
    },
    [insigniaId],
  );

  const updateElemento = useCallback(
    async (elementoId: number, tipo: string, cantidad?: number) => {
      if (!insigniaId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.put<{ elemento: ElementoInsignia }>(
          ElementoInsigniaEndpoints.update(elementoId),
          { tipo, cantidad },
        );
        setElementos((prev) => prev.map((e) => (e.id === elementoId ? res.data.elemento : e)));
      } catch (err: unknown) {
        console.error("Error al actualizar elemento:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al actualizar elemento");
      } finally {
        setLoading(false);
      }
    },
    [insigniaId],
  );

  const deleteElemento = useCallback(
    async (elementoId: number) => {
      if (!insigniaId) return;
      setLoading(true);
      setError(null);
      try {
        await axiosClient.delete(ElementoInsigniaEndpoints.delete(elementoId));
        setElementos((prev) => prev.filter((e) => e.id !== elementoId));
      } catch (err: unknown) {
        console.error("Error al borrar elemento:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al borrar elemento");
      } finally {
        setLoading(false);
      }
    },
    [insigniaId],
  );

  return {
    elementos,
    elementosUI,
    loading,
    error,
    createElemento,
    updateElemento,
    deleteElemento,
    refresh: fetchElementos,
  };
};
