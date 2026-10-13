import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import axiosClient from "../api/axiosClient";

/* =====================================================
   TIPOS · Espejo de procesion.service.ts
   ===================================================== */

export interface HermanoEnPuesto {
  id: number;
  numeroAntiguedad: number;
  nombre: string;
  apellidos: string;
}

export interface PuestoEnTramo {
  id: number;
  nombre: string;
  hermanos: HermanoEnPuesto[];
}

export interface TramoEnProcesion {
  id: number;
  nombre: string;
  orden: number;
  puestos: PuestoEnTramo[];
}

export interface Procesion {
  cortejo: { id: number; nombre: string; orden: number };
  tramos: TramoEnProcesion[];
  totales: { tramos: number; puestos: number; hermanos: number };
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const mensajeDe = (err: unknown, porDefecto: string): string => {
  if (isAxiosError<ApiErrorResponse>(err)) {
    return err.response?.data?.message ?? err.response?.data?.error ?? porDefecto;
  }
  if (err instanceof Error) return err.message;
  return porDefecto;
};

/* =====================================================
   HOOK
   ===================================================== */

/**
 * La procesión de un cortejo: tramos, puestos y hermanos.
 *
 * Trae el árbol entero de una vez porque la vista lo muestra entero:
 * pedir cada tramo por separado serían seis u ocho viajes solo para
 * pintar la página.
 */
export const useProcesion = (cofradiaId: number, cortejoId: number) => {
  const [procesion, setProcesion] = useState<Procesion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activo = cofradiaId > 0 && cortejoId > 0;

  const refetch = useCallback(async () => {
    if (!activo) {
      setProcesion(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get<Procesion>(
        `/cofradias/${cofradiaId}/cortejos/${cortejoId}/procesion`,
      );
      setProcesion(res.data);
    } catch (err) {
      setError(mensajeDe(err, "Error al cargar la procesión"));
    } finally {
      setLoading(false);
    }
  }, [cofradiaId, cortejoId, activo]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { procesion, loading, error, refetch };
};
