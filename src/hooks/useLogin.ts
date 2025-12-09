import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";
import type { AxiosError } from "axios";
import { AuthEndpoints } from "../api/api";

interface LoginPayload {
  username: string;
  password: string;
}

interface DecodedToken {
  id: number;
  username: string;
  role: "DMG" | "AUXILIAR";
  email: string;
  hermandadId: number;
  iat: number;
  exp: number;
}

export const useLogin = (domain: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload): Promise<DecodedToken | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.post<{
        accessToken: string;
        refreshToken: string;
      }>(AuthEndpoints.login(domain), payload, { withCredentials: true });

      localStorage.setItem("accessToken", res.data.accessToken);
      const user: DecodedToken = jwtDecode(res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      // Guardamos el dominio
      localStorage.setItem("domain", domain);

      return user;
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      console.error("Login error:", axiosErr);
      setError(axiosErr.response?.data?.error || "Error al iniciar sesión");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
