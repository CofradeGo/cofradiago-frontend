import React, { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
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
        {/* Header */}
        <Header
          username={user.username}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 mt-4 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
