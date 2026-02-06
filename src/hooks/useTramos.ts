import { useCallback, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { TramoEndpoints } from "../api/api";

/* =======================
   Tipos
======================= */

export interface Tramo {
  id: number;
  nombre: string;
  orden: number;
  cortejoId: number;
}

export interface TramoUI {
  id: number;
  title: string;
  subtitle?: string;
}

interface UseTramosReturn {
  tramos: Tramo[];
  tramosUI: TramoUI[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/* =======================
   Hook
======================= */

export const useTramos = (cofradiaId: number, cortejoId: number): UseTramosReturn => {
  const [tramos, setTramos] = useState<Tramo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTramos = useCallback(async () => {
    if (!cofradiaId || !cortejoId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.get<Tramo[]>(TramoEndpoints.list(cofradiaId, cortejoId));

      setTramos(res.data);
    } catch (err: unknown) {
      console.error("Error al cargar tramos:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al cargar tramos");
      }
    } finally {
      setLoading(false);
    }
  }, [cofradiaId, cortejoId]);

  useEffect(() => {
    fetchTramos();
  }, [fetchTramos]);

  /* =======================
     Adaptación a UI
  ======================= */

  const tramosUI: TramoUI[] = tramos.map((tramo) => ({
    id: tramo.id,
    title: tramo.nombre,
    subtitle: `Orden ${tramo.orden}`,
  }));

  return {
    tramos,
    tramosUI,
    loading,
    error,
    refetch: fetchTramos,
  };
};
