import { useCallback, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { PuestoEnpoints } from "../api/api";
import type { AxiosError } from "axios";
import type { Puesto, PuestoUI } from "../types/Puesto";

/* =====================================================
   TIPOS
===================================================== */

interface ApiErrorResponse {
  message?: string;
}

interface CreatePuestoInput {
  nombre: string;
  codigo?: string;
}

interface UpdatePuestoInput {
  nombre?: string;
  codigo?: string;
}

/* =====================================================
   ADAPTADOR DOMINIO → UI
===================================================== */

const mapPuestoToUI = (p: Puesto): PuestoUI => ({
  id: p.id,
  title: p.nombre,
  subtitle: p.codigo,
});

/* =====================================================
   HOOK
===================================================== */

export const usePuestos = (cofradiaId: number) => {
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ================= LISTAR ================= */
  const fetchPuestos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<Puesto[]>(PuestoEnpoints.list(cofradiaId));

      setPuestos(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      console.error("❌ Error al listar puestos", axiosError);

      setError(axiosError.response?.data?.message ?? "Error al cargar los puestos de la cofradía");
    } finally {
      setLoading(false);
    }
  }, [cofradiaId]);

  useEffect(() => {
    fetchPuestos();
  }, [fetchPuestos]);

  /* ================= CREAR ================= */
  const createPuesto = async (input: CreatePuestoInput): Promise<PuestoUI> => {
    try {
      setError(null);

      const response = await axiosClient.post<{ puesto: Puesto }>(
        PuestoEnpoints.create(cofradiaId),
        input,
      );

      const nuevo = response.data.puesto;

      setPuestos((prev) => [...prev, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre)));

      return mapPuestoToUI(nuevo);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message ?? "Error al crear el puesto";

      setError(message);
      throw new Error(message);
    }
  };

  /* ================= EDITAR ================= */
  const updatePuesto = async (puestoId: number, input: UpdatePuestoInput): Promise<PuestoUI> => {
    try {
      setError(null);

      const response = await axiosClient.put<{ puesto: Puesto }>(
        PuestoEnpoints.update(cofradiaId, puestoId),
        input,
      );

      const actualizado = response.data.puesto;

      setPuestos((prev) => prev.map((p) => (p.id === puestoId ? actualizado : p)));

      return mapPuestoToUI(actualizado);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message ?? "Error al editar el puesto";

      setError(message);
      throw new Error(message);
    }
  };

  /* ================= BORRAR ================= */
  const deletePuesto = async (puestoId: number): Promise<void> => {
    try {
      setError(null);

      await axiosClient.delete(PuestoEnpoints.delete(cofradiaId, puestoId));

      setPuestos((prev) => prev.filter((p) => p.id !== puestoId));
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message ?? "Error al borrar el puesto";

      setError(message);
      throw new Error(message);
    }
  };

  /* ================= API ================= */
  return {
    puestosUI: puestos.map(mapPuestoToUI), // 👈 SOLO UI SALE DEL HOOK
    loading,
    error,
    refetch: fetchPuestos,
    createPuesto,
    updatePuesto,
    deletePuesto,
  };
};
