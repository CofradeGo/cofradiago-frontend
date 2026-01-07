import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import { InsigniaEndpoints, ElementoInsigniaEndpoints } from "../api/api";

export interface ElementoInsignia {
  id: number;
  tipo: string;
  cantidad: number;
  insigniaId: number;
}

export interface Insignia {
  id: number;
  cofradiaId: number;
  nombre: string;
  descripcion?: string;
  elementos?: ElementoInsignia[];
  createdAt: string;
  updatedAt: string;
}

export interface InsigniaUI {
  id: number;
  title: string;
  subtitle?: string;
}

interface UseInsigniasReturn {
  insignias: Insignia[];
  insigniasUI: InsigniaUI[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useInsigniasWithElements = (cofradiaId: number): UseInsigniasReturn => {
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsignias = useCallback(async () => {
    if (!cofradiaId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.get<Insignia[]>(InsigniaEndpoints.list(cofradiaId));
      const insigniasData = res.data;

      const insigniasConElementos = await Promise.all(
        insigniasData.map(async (i) => {
          try {
            const elementosRes = await axiosClient.get<ElementoInsignia[]>(
              ElementoInsigniaEndpoints.list(i.id),
            );
            return { ...i, elementos: elementosRes.data };
          } catch {
            return { ...i, elementos: [] };
          }
        }),
      );

      setInsignias(insigniasConElementos);
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

  // Adaptador para ListCard: incluimos nombre y cantidad de cada elemento
  const insigniasUI: InsigniaUI[] = insignias.map((i) => ({
    id: i.id,
    title: i.nombre,
    subtitle:
      i.elementos && i.elementos.length > 0
        ? i.elementos.map((e) => `${e.tipo}: ${e.cantidad}`).join("\n")
        : undefined,
  }));

  return {
    insignias,
    insigniasUI,
    loading,
    error,
    refresh: fetchInsignias,
  };
};
