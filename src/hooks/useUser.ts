// src/hooks/useUser.ts
import { useState, useEffect } from "react";
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

export interface CreateUserPayload {
  username: string;
  password: string;
  email?: string;
}

interface UseUserReturn {
  user: User | null;
  users: User[] | null;
  loading: boolean;
  error: string | null;
  updateUsuario: (data: UpdateUserPayload) => Promise<User>;
  changePassword: (data: ChangePasswordPayload) => Promise<void>;
  createAuxUser: (data: CreateUserPayload) => Promise<User>;
  refetchUsers: () => void;
  deleteUsuario: (userId: number) => Promise<string>;
}

export const useUsuario = (): UseUserReturn => {
  // Usuario logueado
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------- Funciones --------------------

  // Fetch todos los usuarios
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get<{ users: User[] }>(UserEndpoints.getAll, {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (err) {
      let msg = "Error al cargar usuarios";
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        msg = axiosErr.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      setUsers(null);
    } finally {
      setLoading(false);
    }
  };

  // Refetch manual
  const refetchUsers = () => {
    fetchUsers();
  };

  // Actualizar usuario logueado
  const updateUsuario = async (data: UpdateUserPayload): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.patch<{ user: User }>(UserEndpoints.updateCurrent, data, {
        withCredentials: true,
      });
      const updated = res.data.user;
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    } catch (err) {
      let msg = "Error al actualizar usuario";
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        msg = axiosErr.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const changePassword = async (data: ChangePasswordPayload): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.patch(UserEndpoints.updateCurrent, data, { withCredentials: true });
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

  // Crear usuario AUX
  const createAuxUser = async (data: CreateUserPayload): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.post<{ message: string; user: User }>(
        UserEndpoints.registerAux,
        data,
        { withCredentials: true },
      );
      // Opcional: refrescar usuarios tras creación
      fetchUsers();
      return res.data.user;
    } catch (err) {
      let msg = "Error al crear usuario AUX";
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

  // Eliminar usuario (soft delete)
  const deleteUsuario = async (userId: number): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.patch<{ message: string }>(
        `/users/${userId}`,
        {},
        { withCredentials: true },
      );
      // Refetch users tras eliminación
      fetchUsers();
      return res.data.message;
    } catch (err) {
      let msg = "Error al eliminar usuario";
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

  // -------------------- Hook init --------------------
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    user,
    users,
    loading,
    error,
    updateUsuario,
    changePassword,
    createAuxUser,
    refetchUsers,
    deleteUsuario,
  };
};
