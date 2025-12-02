import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import type { AxiosError } from "axios";

export interface Hermandad {
  domain: string;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
}

export const useHermandad = (domain: string, useToken: boolean = false) => {
  const [data, setData] = useState<Hermandad | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!domain) return;

    let isMounted = true;

    const fetchHermandad = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers: Record<string, string> = {};

        if (useToken) {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No hay token disponible");
          headers["Authorization"] = `Bearer ${token}`;
        }

        const endpoint = useToken ? `/api/v1/hermandad/${domain}` : `/public/hermandad/${domain}`;

        const res = await axiosClient.get<Hermandad>(endpoint, { headers });

        if (isMounted) setData(res.data);
      } catch (err) {
        const axiosErr = err as AxiosError<{ error: string }>;
        if (isMounted) {
          setError(
            axiosErr.response?.data?.error ||
              (err as Error).message ||
              "Error al cargar la hermandad",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHermandad();

    return () => {
      isMounted = false;
    };
  }, [domain, useToken]);

  return { data, loading, error };
};
