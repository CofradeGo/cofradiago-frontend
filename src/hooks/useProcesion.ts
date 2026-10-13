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

/**
 * Un elemento colocado en un tramo: un puesto, una insignia o un cargo.
 *
 * `plazas` es cuántas personas hacen falta, no cuántas hay ya. En los
 * tres significa lo mismo, por eso comparten forma y se editan con el
 * mismo selector.
 */
export interface ElementoEnTramo {
  id: number;
  nombre: string;
  plazas: number;
  hermanos: HermanoEnPuesto[];
}

export interface InsigniaEnTramo extends ElementoEnTramo {
  descripcion?: string | null;
}

export type PuestoEnTramo = ElementoEnTramo;
export type CargoEnTramo = ElementoEnTramo;

/** Un elemento con las plazas que ocupa en el tramo, al guardarlo. */
export interface ElementoConPlazas {
  id: number;
  plazas: number;
}

/** Las tres clases de elemento que se colocan en un tramo. */
export type ClaseElemento = "insignias" | "cargos" | "puestos";

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
    /** Personas que hacen falta, sumando puestos, insignias y cargos. */
    plazas: number;
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

  /**
   * Guarda qué insignias, cargos o puestos van en el tramo, y cuántas
   * plazas de cada uno. Manda siempre la lista completa.
   */
  const guardarElementos = async (
    clase: ClaseElemento,
    cortejoId: number,
    tramoId: number,
    elementos: ElementoConPlazas[],
  ): Promise<void> => {
    try {
      await axiosClient.put(TramoEndpoints.setElementos(clase, cofradiaId, cortejoId, tramoId), {
        [clase]: elementos,
      });
      // Se recarga para que la vista refleje lo guardado sin tener que
      // reconstruir el árbol a mano en el estado local.
      await refetch();
    } catch (err) {
      const enPlural = `${clase} del tramo`;
      throw new Error(mensajeDe(err, `No se ha podido guardar las ${enPlural}`));
    }
  };

  return {
    procesion,
    loading,
    error,
    refetch,
    guardarElementos,
  };
};
