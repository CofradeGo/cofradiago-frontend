// src/components/layouts/DashboardLayout.tsx
import React, { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useHermandad } from "../../hooks/useHermandad";
import { ChangePasswordModal } from "../molecules/ChangePasswordModal";

export const DashboardLayout: React.FC = () => {
  const { domain } = useParams<{ domain: string }>();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

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

  const handleToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fijo siempre */}
      <Sidebar
        role={user.role}
        hermandadName={hermandad.name}
        hermandadLogo={hermandad.logoUrl}
        className={`fixed top-0 left-0 h-full z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header sticky */}
        <div className="sticky top-0 z-20">
          <Header
            username={user.username}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onOpenChangePasswordModal={() => setIsChangePasswordModalOpen(true)}
          />
        </div>

        {/* Main content scrollable */}
        <main className="flex-1 p-6 mt-4 md:mt-0 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Modal de cambiar contraseña */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSuccess={handleToast}
      />

      {/* Toast centrado */}
      {toastMessage && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md shadow-lg text-white z-50
            transition-opacity duration-500 ${showToast ? "opacity-100" : "opacity-0"} bg-green-600`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
