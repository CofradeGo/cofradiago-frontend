import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import axiosClient from "../api/axiosClient";
import { CortejoEndpoints } from "../api/api";
import type { Cortejo, CortejoInput, CortejoUpdateInput } from "../types/Organizacion";

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

/**
 * Cortejos de una cofradía.
 *
 * Lanza el error en lugar de devolver null: los formularios necesitan
 * mostrar el mensaje real (por ejemplo "Ya existe un cortejo con ese
 * nombre") en lugar de un texto genérico.
 */
export const useCortejos = (cofradiaId: number) => {
  const [cortejos, setCortejos] = useState<Cortejo[]>([]);
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

  const activo = cofradiaId > 0;

  const fetchCortejos = useCallback(async () => {
    if (!activo) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get<Cortejo[]>(CortejoEndpoints.listByCofradia(cofradiaId));
      // El orden de marcha es lo relevante para un cortejo.
      setCortejos([...res.data].sort((a, b) => a.orden - b.orden));
    } catch (err) {
      setError(mensajeDe(err, "Error al cargar los cortejos"));
    } finally {
      setLoading(false);
    }
  }, [cofradiaId, activo]);

  useEffect(() => {
    void fetchCortejos();
  }, [fetchCortejos]);

  const crearCortejo = async (input: CortejoInput): Promise<Cortejo> => {
    try {
      setError(null);
      const res = await axiosClient.post<{ cortejo: Cortejo }>(
        CortejoEndpoints.create(cofradiaId),
        input,
      );
      setCortejos((prev) => [...prev, res.data.cortejo].sort((a, b) => a.orden - b.orden));
      return res.data.cortejo;
    } catch (err) {
      throw new Error(mensajeDe(err, "Error al crear el cortejo"));
    }
  };

  const editarCortejo = async (cortejoId: number, input: CortejoUpdateInput): Promise<Cortejo> => {
    try {
      setError(null);
      const res = await axiosClient.put<{ cortejo: Cortejo }>(
        CortejoEndpoints.update(cofradiaId, cortejoId),
        input,
      );
      setCortejos((prev) =>
        prev
          .map((c) => (c.id === cortejoId ? res.data.cortejo : c))
          .sort((a, b) => a.orden - b.orden),
      );
      return res.data.cortejo;
    } catch (err) {
      throw new Error(mensajeDe(err, "Error al editar el cortejo"));
    }
  };

  const borrarCortejo = async (cortejoId: number): Promise<void> => {
    try {
      setError(null);
      await axiosClient.delete(CortejoEndpoints.delete(cofradiaId, cortejoId));
      setCortejos((prev) => prev.filter((c) => c.id !== cortejoId));
    } catch (err) {
      throw new Error(mensajeDe(err, "Error al borrar el cortejo"));
    }
  };

  /**
   * Guarda el orden tras un arrastre. El servidor asigna las
   * posiciones, así que aquí solo se envían los ids ordenados y se
   * adopta la respuesta como nueva verdad.
   */
  const reordenarCortejos = async (ids: number[]): Promise<void> => {
    try {
      setError(null);
      const res = await axiosClient.patch<{ cortejos: Cortejo[] }>(
        CortejoEndpoints.reorder(cofradiaId),
        { ids },
      );
      setCortejos(res.data.cortejos);
    } catch (err) {
      throw new Error(mensajeDe(err, "Error al guardar el nuevo orden"));
    }
  };

  return {
    cortejos,
    loading,
    error,
    refetch: fetchCortejos,
    crearCortejo,
    editarCortejo,
    borrarCortejo,
    reordenarCortejos,
  };
};
