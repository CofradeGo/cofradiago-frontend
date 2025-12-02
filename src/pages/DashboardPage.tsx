import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHermandad } from "../hooks/useHermandad";

interface User {
  id: string;
  username: string;
  role: "DMG" | "AUXILIAR";
  email: string;
  hermandadId: number;
}

export const DashboardPage: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();

  // Leer usuario desde localStorage
  const userStr = localStorage.getItem("user");
  const user: User | null = userStr ? JSON.parse(userStr) : null;

  // Llamamos el hook siempre, aunque user sea null
  const { data: hermandad, loading, error } = useHermandad(domain || "", true);

  // Redirigir al login si no hay usuario
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null; // mientras se redirige

  if (loading) return <div className="text-center mt-10">Cargando dashboard...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-xl mb-2">Hermandad: {hermandad?.name}</p>
      <p className="text-lg">Hola {user.role === "DMG" ? "DMG" : "Auxiliar"} 👋</p>
    </div>
  );
};
