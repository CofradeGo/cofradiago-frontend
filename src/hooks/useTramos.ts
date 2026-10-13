import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
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

export interface TramoInput {
  nombre: string;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

/** El backend responde { error, message } tras la unificación del contrato. */
const mensajeDe = (err: unknown, porDefecto: string): string => {
  if (isAxiosError<ApiErrorResponse>(err)) {
    return err.response?.data?.message ?? err.response?.data?.error ?? porDefecto;
  }
  if (err instanceof Error) return err.message;
  return porDefecto;
};

/* =======================
   Hook
======================= */

export const useTramos = (cofradiaId: number, cortejoId: number) => {
  const [tramos, setTramos] = useState<Tramo[]>([]);
  const [loading, setLoading] = useState(false);
  /**
   * Error al cargar la lista, no al guardar.
   *
   * La tabla sustituye las filas por este aviso, así que una mutación
   * fallida no debe tocarlo: se propaga con `throw` y quien la llama
   * la enseña en el formulario o en un toast. Si se guardara aquí,
   * un alta duplicada dejaría la tabla entera sin filas.
   */
  const [error, setError] = useState<string | null>(null);

  const activo = cofradiaId > 0 && cortejoId > 0;

  const fetchTramos = useCallback(async () => {
    if (!activo) {
      setTramos([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get<Tramo[]>(TramoEndpoints.list(cofradiaId, cortejoId));
      setTramos(res.data);
    } catch (err) {
      setError(mensajeDe(err, "Error al cargar los tramos"));
    } finally {
      setLoading(false);
    }
  }, [cofradiaId, cortejoId, activo]);

  useEffect(() => {
    void fetchTramos();
  }, [fetchTramos]);

  /* =======================
     Mutaciones
  ======================= */

  const crearTramo = async (input: TramoInput): Promise<Tramo> => {
    if (!activo) throw new Error("Selecciona un cortejo antes de añadir tramos");

    try {
      setError(null);
      const res = await axiosClient.post<{ tramo: Tramo }>(
        TramoEndpoints.create(cofradiaId, cortejoId),
        input,
      );
      await fetchTramos();
      return res.data.tramo;
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al crear el tramo");
      throw new Error(mensaje);
    }
  };

  const editarTramo = async (tramoId: number, input: TramoInput): Promise<Tramo> => {
    if (!activo) throw new Error("Selecciona un cortejo antes de editar");

    try {
      setError(null);
      const res = await axiosClient.put<{ tramo: Tramo }>(
        TramoEndpoints.update(cofradiaId, cortejoId, tramoId),
        input,
      );
      await fetchTramos();
      return res.data.tramo;
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al editar el tramo");
      throw new Error(mensaje);
    }
  };

  const borrarTramo = async (tramoId: number): Promise<void> => {
    if (!activo) throw new Error("Selecciona un cortejo antes de borrar");

    try {
      setError(null);
      await axiosClient.delete(TramoEndpoints.delete(cofradiaId, cortejoId, tramoId));
      await fetchTramos();
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al borrar el tramo");
      throw new Error(mensaje);
    }
  };

  /**
   * Guarda el orden tras un arrastre. Como en los cortejos, el
   * servidor asigna las posiciones y devuelve la lista ya ordenada.
   */
  const reordenarTramos = async (ids: number[]): Promise<void> => {
    if (!activo) return;

    try {
      setError(null);
      const res = await axiosClient.patch<{ tramos: Tramo[] }>(
        TramoEndpoints.reorder(cofradiaId, cortejoId),
        { ids },
      );
      setTramos(res.data.tramos);
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al guardar el nuevo orden");
      throw new Error(mensaje);
    }
  };

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
    crearTramo,
    editarTramo,
    borrarTramo,
    reordenarTramos,
  };
};
