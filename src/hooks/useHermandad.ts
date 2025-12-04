import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import type { AxiosError } from "axios";
import { HermandadEndpoints } from "../api/api";

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
        // Público o privado según useToken
        const endpoint = useToken
          ? HermandadEndpoints.private(domain) // Axios une baseURL + API_BASE + /hermandad/...
          : `${import.meta.env.VITE_API_URL}${HermandadEndpoints.public(domain)}`;
        // ruta completa para público

        const res = await axiosClient.get(endpoint);

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
