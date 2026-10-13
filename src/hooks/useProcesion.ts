import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import axiosClient from "../api/axiosClient";
import { TramoEndpoints } from "../api/api";

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

/** Insignia asignada a un tramo. Sin personas todavía: eso llega con
 *  el módulo de papeleta de sitio. */
export interface InsigniaEnTramo {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface CargoEnTramo {
  id: number;
  nombre: string;
  /** Cuántas plazas de ese cargo hay en el tramo. */
  cantidad: number;
}

/** Un cargo al que se le indica cuántas plazas ocupa en el tramo. */
export interface CargoConPlazas {
  id: number;
  cantidad: number;
}

export interface TramoEnProcesion {
  id: number;
  nombre: string;
  orden: number;
  puestos: PuestoEnTramo[];
  insignias: InsigniaEnTramo[];
  cargos: CargoEnTramo[];
}

export interface Procesion {
  cortejo: { id: number; nombre: string; orden: number };
  tramos: TramoEnProcesion[];
  totales: {
    tramos: number;
    puestos: number;
    hermanos: number;
    insignias: number;
    cargos: number;
  };
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

  /** Guarda qué insignias van en el tramo. Manda la lista completa. */
  const guardarInsignias = async (
    cortejoId: number,
    tramoId: number,
    insigniaIds: number[],
  ): Promise<void> => {
    try {
      await axiosClient.put(TramoEndpoints.setInsignias(cofradiaId, cortejoId, tramoId), {
        insigniaIds,
      });
      // Se recarga para que la vista refleje lo guardado sin tener que
      // reconstruir el árbol a mano en el estado local.
      await refetch();
    } catch (err) {
      throw new Error(mensajeDe(err, "No se ha podido guardar las insignias del tramo"));
    }
  };

  /**
   * Guarda qué cargos van en el tramo y cuántas plazas de cada uno.
   * Manda la lista completa.
   */
  const guardarCargos = async (
    cortejoId: number,
    tramoId: number,
    cargos: CargoConPlazas[],
  ): Promise<void> => {
    try {
      await axiosClient.put(TramoEndpoints.setCargos(cofradiaId, cortejoId, tramoId), {
        cargos,
      });
      await refetch();
    } catch (err) {
      throw new Error(mensajeDe(err, "No se ha podido guardar los cargos del tramo"));
    }
  };

  return {
    procesion,
    loading,
    error,
    refetch,
    guardarInsignias,
    guardarCargos,
  };
};
