import { useState, useCallback, useRef, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { AxiosError, type AxiosResponse } from "axios";
import { PasswordEndpoints } from "../api/api";

interface ForgotPasswordPayload {
  username: string;
  domain: string;
}

interface ForgotPasswordResponse {
  message: string;
}

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🔹 Referencia al AbortController para cancelar la petición
  const abortControllerRef = useRef<AbortController | null>(null);

  // 🔹 Limpiar si se desmonta el componente
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendForgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    const { username, domain } = payload;

    // Validaciones previas
    if (!username.trim()) {
      setError("Introduce tu nombre de usuario.");
      return;
    }
    if (!domain) {
      setError("No se pudo determinar la hermandad. Revisa la URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // 🔹 Crear nuevo AbortController para esta petición
    abortControllerRef.current = new AbortController();

    try {
      const response: AxiosResponse<ForgotPasswordResponse> = await axiosClient.post(
        PasswordEndpoints.forgot,
        { username: username.trim(), domain },
        { signal: abortControllerRef.current.signal },
      );

      setSuccess(response.data.message);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;

      // Comprobamos si es un Cancel por AbortController
      if (axiosError.code === "ERR_CANCELED") return;

      setError(
        axiosError.response?.data?.message ||
          "Ocurrió un error al enviar el email. Intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    success,
    sendForgotPassword,
  };
};
