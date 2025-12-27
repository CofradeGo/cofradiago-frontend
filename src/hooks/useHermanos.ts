import { useEffect, useState } from "react";
import axios from "axios";
import axiosClient from "../api/axiosClient";
import type { HermanosListResponse, HermanoListado } from "../types/hermano";

/* ============================
   Tipos
============================ */

export interface HermanosFiltersState {
  search?: string;
  direccion?: string;
  edadMin?: number;
  edadMax?: number;
}

export interface UseHermanosReturn {
  hermanos: HermanoListado[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;

  filters: HermanosFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<HermanosFiltersState>>;
  setPage: (page: number) => void;
}

/* ============================
   Hook
============================ */

export const useHermanos = (): UseHermanosReturn => {
  const [hermanos, setHermanos] = useState<HermanoListado[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [filters, setFilters] = useState<HermanosFiltersState>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================
     Fetch
  ============================ */

  const fetchHermanos = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.get<HermanosListResponse>("/hermanos", {
        params: {
          page,
          limit,
          order: "asc",
          ...(filters.search && { search: filters.search }),
          ...(filters.direccion && { direccion: filters.direccion }),
          ...(filters.edadMin !== undefined && { edadMin: filters.edadMin }),
          ...(filters.edadMax !== undefined && { edadMax: filters.edadMax }),
        },
        withCredentials: true,
      });

      setHermanos(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      let msg = "Error al cargar hermanos";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      setHermanos([]);
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     Effects
  ============================ */

  useEffect(() => {
    fetchHermanos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  /* ============================
     Return
  ============================ */

  return {
    hermanos,
    total,
    page,
    limit,
    loading,
    error,
    filters,
    setFilters,
    setPage,
  };
};
