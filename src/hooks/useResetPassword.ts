import { useState, useCallback, useRef, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { AxiosError, type AxiosResponse } from "axios";
import { PasswordEndpoints } from "../api/api";

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // AbortController para cancelar la petición si se desmonta
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const sendResetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    const { token, newPassword } = payload;

    // Validaciones simples
    if (!token.trim()) {
      setError("Token inválido o ausente.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    abortControllerRef.current = new AbortController();

    try {
      const response: AxiosResponse<ResetPasswordResponse> = await axiosClient.post(
        PasswordEndpoints.reset,
        { token, newPassword },
        { signal: abortControllerRef.current.signal },
      );

      setSuccess(response.data.message);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;

      if (axiosError.code === "ERR_CANCELED") return;

      setError(
        axiosError.response?.data?.message ||
          "Ocurrió un error al cambiar la contraseña. Intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    success,
    sendResetPassword,
  };
};
