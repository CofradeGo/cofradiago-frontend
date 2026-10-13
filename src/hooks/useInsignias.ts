import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import axiosClient from "../api/axiosClient";
import { InsigniaEndpoints } from "../api/api";
import type { Insignia, InsigniaInput, InsigniaUpdateInput } from "../types/Organizacion";

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

/**
 * Insignias de una cofradía.
 *
 * Complementa a useInsigniasConElementos, que solo lee y además carga
 * los elementos de una en una. Aquí solo gestionamos la lista y el
 * CRUD; los elementos tienen su propia pantalla.
 */
export const useInsignias = (cofradiaId: number) => {
  const [insignias, setInsignias] = useState<Insignia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activo = cofradiaId > 0;

  const fetchInsignias = useCallback(async () => {
    if (!activo) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get<Insignia[]>(InsigniaEndpoints.list(cofradiaId));
      setInsignias([...res.data].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
    } catch (err) {
      setError(mensajeDe(err, "Error al cargar las insignias"));
    } finally {
      setLoading(false);
    }
  }, [cofradiaId, activo]);

  useEffect(() => {
    void fetchInsignias();
  }, [fetchInsignias]);

  const crearInsignia = async (input: InsigniaInput): Promise<Insignia> => {
    try {
      setError(null);
      const res = await axiosClient.post<{ insignia: Insignia }>(
        InsigniaEndpoints.create(cofradiaId),
        input,
      );
      setInsignias((prev) =>
        [...prev, res.data.insignia].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
      );
      return res.data.insignia;
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al crear la insignia");
      setError(mensaje);
      throw new Error(mensaje);
    }
  };

  const editarInsignia = async (
    insigniaId: number,
    input: InsigniaUpdateInput,
  ): Promise<Insignia> => {
    try {
      setError(null);
      const res = await axiosClient.put<{ insignia: Insignia }>(
        InsigniaEndpoints.update(cofradiaId, insigniaId),
        input,
      );
      setInsignias((prev) =>
        prev
          .map((i) => (i.id === insigniaId ? res.data.insignia : i))
          .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
      );
      return res.data.insignia;
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al editar la insignia");
      setError(mensaje);
      throw new Error(mensaje);
    }
  };

  const borrarInsignia = async (insigniaId: number): Promise<void> => {
    try {
      setError(null);
      await axiosClient.delete(InsigniaEndpoints.delete(cofradiaId, insigniaId));
      setInsignias((prev) => prev.filter((i) => i.id !== insigniaId));
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al borrar la insignia");
      setError(mensaje);
      throw new Error(mensaje);
    }
  };

  return {
    insignias,
    loading,
    error,
    refetch: fetchInsignias,
    crearInsignia,
    editarInsignia,
    borrarInsignia,
  };
};
