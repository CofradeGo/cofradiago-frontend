import React, { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useHermandad } from "../../hooks/useHermandad";

export const DashboardLayout: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: hermandad, loading, error } = useHermandad(domain || "", false);

  if (!user) return null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">Cargando dashboard...</div>
    );

  if (error || !hermandad)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || "No se pudo cargar la hermandad"}
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        role={user.role}
        hermandadName={hermandad.name}
        hermandadLogo={hermandad.logoUrl}
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        {/* Header mobile */}
        <header className="flex items-center justify-between p-4 bg-white shadow md:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 focus:outline-none">
            {/* Icono hamburguesa */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="font-bold text-lg">{hermandad.name}</h1>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
