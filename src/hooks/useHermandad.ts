import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import type { AxiosError } from "axios";
import { HermandadEndpoints } from "../api/api";

export interface Hermandad {
  id?: number;
  domain: string;
  name: string;
  logoUrl?: string;
  officialEmail?: string;
  primaryColor?: string;
}

export const useHermandad = (domain: string, useToken: boolean = false) => {
  const [data, setData] = useState<Hermandad | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Fetch hermandad
  const fetchHermandad = useCallback(async () => {
    if (!domain) return;
    setLoading(true);
    setError(null);

    try {
      const endpoint = useToken
        ? HermandadEndpoints.private(domain)
        : `${import.meta.env.VITE_API_URL}${HermandadEndpoints.public(domain)}`;

      const res = await axiosClient.get<Hermandad>(endpoint, {
        withCredentials: useToken,
      });

      setData(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
      setError(
        axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          (err as Error).message ||
          "Error al cargar la hermandad",
      );
    } finally {
      setLoading(false);
    }
  }, [domain, useToken]);

  // Update hermandad
  const updateHermandad = useCallback(
    async (formData: FormData) => {
      setUpdating(true);
      setUpdateError(null);

      try {
        const res = await axiosClient.put<Hermandad>(HermandadEndpoints.private(domain), formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Actualizamos solo los campos devueltos
        setData(res.data);
        return res.data;
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
        const msg =
          axiosErr.response?.data?.error ||
          axiosErr.response?.data?.message ||
          (err as Error).message ||
          "Error al actualizar la hermandad";
        setUpdateError(msg);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [domain],
  );

  useEffect(() => {
    fetchHermandad();
  }, [fetchHermandad]);

  return {
    data,
    loading,
    error,
    updating,
    updateError,
    refetch: fetchHermandad,
    updateHermandad,
  };
};
