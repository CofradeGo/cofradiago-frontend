import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export interface User {
  id: number;
  username: string;
  email: string;
  role: "DMG" | "AUXILIAR";
  createdAt: string;
  updatedAt: string;
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        // Llamada al endpoint
        const res = await axiosClient.get<{ users: User[] }>("/users");

        const currentUserStr = localStorage.getItem("user");
        if (!currentUserStr) throw new Error("Usuario no logueado");

        const currentUser = JSON.parse(currentUserStr) as User;

        // Filtra para obtener solo el usuario actual
        const myUser = res.data.users.find((u) => u.id === currentUser.id) || null;

        setUser(myUser);
      } catch (err: unknown) {
        console.error("Error fetching current user:", err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al obtener usuario");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};
