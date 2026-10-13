import { useCallback, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import axiosClient from "../api/axiosClient";
import { CargoEndpoints } from "../api/api";
import type { Cargo, CargoUI } from "../types/Cargo";

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

const porNombre = (a: Cargo, b: Cargo) => a.nombre.localeCompare(b.nombre, "es");

/**
 * Cargos de una cofradía: los oficios de la junta directiva.
 *
 * Lanza el error en lugar de solo guardarlo: el formulario necesita
 * mostrar el mensaje real del backend (por ejemplo, que el nombre ya
 * está en uso) en lugar de un texto genérico.
 */
export const useCargos = (cofradiaId: number) => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
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

  const refetch = useCallback(async () => {
    if (!activo) {
      setCargos([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get<Cargo[]>(CargoEndpoints.list(cofradiaId));
      setCargos([...res.data].sort(porNombre));
    } catch (err) {
      setError(mensajeDe(err, "Error al cargar los cargos"));
    } finally {
      setLoading(false);
    }
  }, [cofradiaId, activo]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const crearCargo = async (nombre: string): Promise<Cargo> => {
    try {
      setError(null);
      const res = await axiosClient.post<{ cargo: Cargo }>(CargoEndpoints.create(cofradiaId), {
        nombre,
      });
      setCargos((prev) => [...prev, res.data.cargo].sort(porNombre));
      return res.data.cargo;
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al crear el cargo");
      throw new Error(mensaje);
    }
  };

  const editarCargo = async (cargoId: number, nombre: string): Promise<Cargo> => {
    try {
      setError(null);
      const res = await axiosClient.put<{ cargo: Cargo }>(
        CargoEndpoints.update(cofradiaId, cargoId),
        { nombre },
      );
      setCargos((prev) => prev.map((c) => (c.id === cargoId ? res.data.cargo : c)).sort(porNombre));
      return res.data.cargo;
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al editar el cargo");
      throw new Error(mensaje);
    }
  };

  const borrarCargo = async (cargoId: number): Promise<void> => {
    try {
      setError(null);
      await axiosClient.delete(CargoEndpoints.delete(cofradiaId, cargoId));
      setCargos((prev) => prev.filter((c) => c.id !== cargoId));
    } catch (err) {
      const mensaje = mensajeDe(err, "Error al borrar el cargo");
      throw new Error(mensaje);
    }
  };

  return {
    cargos,
    // La vista mapeada la consumen los listados de tipo tarjeta.
    cargosUI: cargos.map((c): CargoUI => ({ id: c.id, title: c.nombre })),
    loading,
    error,
    refetch,
    crearCargo,
    editarCargo,
    borrarCargo,
  };
};
