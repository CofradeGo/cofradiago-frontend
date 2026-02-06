import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import { CargoEndpoints } from "../api/api";

export interface Cargo {
  id: number;
  cofradiaId: number;
  nombre: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CargoUI {
  id: number;
  title: string;
}

interface UseCargosReturn {
  cargos: Cargo[];
  cargosUI: CargoUI[];
  loading: boolean;
  error: string | null;
  createCargo: (nombre: string) => Promise<void>;
  updateCargo: (cargoId: number, nombre: string) => Promise<void>;
  deleteCargo: (cargoId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useCargos = (cofradiaId: number): UseCargosReturn => {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Adaptador para UI
  const cargosUI: CargoUI[] = cargos.map((c) => ({
    id: c.id,
    title: c.nombre,
  }));

  const fetchCargos = useCallback(async () => {
    if (!cofradiaId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<Cargo[]>(CargoEndpoints.list(cofradiaId));
      setCargos(res.data);
    } catch (err: unknown) {
      console.error("Error al listar cargos:", err);
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido al listar cargos");
    } finally {
      setLoading(false);
    }
  }, [cofradiaId]);

  useEffect(() => {
    fetchCargos();
  }, [fetchCargos]);

  const createCargo = useCallback(
    async (nombre: string) => {
      if (!cofradiaId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.post<{ cargo: Cargo }>(CargoEndpoints.create(cofradiaId), {
          nombre,
        });
        setCargos((prev) => [...prev, res.data.cargo]);
      } catch (err: unknown) {
        console.error("Error al crear cargo:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al crear cargo");
      } finally {
        setLoading(false);
      }
    },
    [cofradiaId],
  );

  const updateCargo = useCallback(
    async (cargoId: number, nombre: string) => {
      if (!cofradiaId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axiosClient.put<{ cargo: Cargo }>(
          CargoEndpoints.update(cofradiaId, cargoId),
          { nombre },
        );
        setCargos((prev) => prev.map((c) => (c.id === cargoId ? res.data.cargo : c)));
      } catch (err: unknown) {
        console.error("Error al editar cargo:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al editar cargo");
      } finally {
        setLoading(false);
      }
    },
    [cofradiaId],
  );

  const deleteCargo = useCallback(
    async (cargoId: number) => {
      if (!cofradiaId) return;
      setLoading(true);
      setError(null);
      try {
        await axiosClient.delete(CargoEndpoints.delete(cofradiaId, cargoId));
        setCargos((prev) => prev.filter((c) => c.id !== cargoId));
      } catch (err: unknown) {
        console.error("Error al borrar cargo:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Error desconocido al borrar cargo");
      } finally {
        setLoading(false);
      }
    },
    [cofradiaId],
  );

  return {
    cargos,
    cargosUI, // ✅ version adaptada para la UI
    loading,
    error,
    createCargo,
    updateCargo,
    deleteCargo,
    refresh: fetchCargos,
  };
};
