// src/hooks/useUsuario.ts
import { useState } from "react";
import axios, { AxiosError } from "axios";
import axiosClient from "../api/axiosClient";
import { UserEndpoints } from "../api/api";
import type { User } from "../types/User";

export interface UpdateUserPayload {
  username?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

interface UseUsuarioReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateUsuario: (data: UpdateUserPayload) => Promise<User>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
}

export const useUsuario = (): UseUsuarioReturn => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUsuario = async (data: UpdateUserPayload): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosClient.patch<{ user: User }>(UserEndpoints.updateCurrent, data, {
        withCredentials: true,
      });

      const updated = res.data.user;

      // guardar
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

      return updated; // ⭐ SIEMPRE devuelve un usuario válido
    } catch (err) {
      let msg = "Error al actualizar usuario";

      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        msg = axiosErr.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }

      setError(msg);
      throw new Error(msg); // ⭐ lanzamos error para que el modal lo capture
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordPayload): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.patch(UserEndpoints.updateCurrent, data, {
        withCredentials: true,
      });
    } catch (err) {
      let msg = "Error al cambiar la contraseña";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, updateUsuario, changePassword };
};
