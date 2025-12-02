// src/hooks/useLogin.ts
import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";
import type { AxiosError } from "axios";

interface LoginPayload {
  username: string;
  password: string;
}

interface DecodedToken {
  id: string;
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
      // Llamada al endpoint de login
      const res = await axiosClient.post<{ token: string }>(
        `/api/v1/auth/login/${domain}`,
        payload,
      );

      // Guardamos el token en localStorage
      localStorage.setItem("token", res.data.token);

      // Decodificamos el token para extraer la info del usuario
      const user: DecodedToken = jwtDecode(res.data.token);

      // Guardamos la info decodificada en localStorage
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (err) {
      const axiosErr = err as AxiosError<{ error: string }>;
      console.error(axiosErr);
      setError(axiosErr.response?.data?.error || "Error al iniciar sesión");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
