// src/pages/UserPage.tsx
import React, { useState } from "react";
import { UsersList } from "../../components/organisms/UsersList";

export const UsuariosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "create">("users");

  // Rol del usuario logueado
  const userStr = localStorage.getItem("user");
  const currentUserRole = userStr ? JSON.parse(userStr).role : "AUXILIAR";

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Tabs container */}
      <div className="flex border-b border-gray-200 relative">
        {/* Tab: Usuarios */}
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium transition-colors duration-300 text-gray-700 hover:text-gray-900 focus:outline-none ${
            activeTab === "users" ? "text-gray-900" : ""
          }`}
        >
          Usuarios
        </button>

        {/* Tab: Crear Usuario */}
        <button
          onClick={() => setActiveTab("create")}
          className={`ml-4 px-4 py-2 font-medium transition-colors duration-300 text-gray-700 hover:text-gray-900 focus:outline-none ${
            activeTab === "create" ? "text-gray-900" : ""
          }`}
        >
          Crear Usuario
        </button>

        {/* Slider animado debajo de la tab activa */}
        <div
          className={`absolute bottom-0 h-1 bg-blue-500 rounded transition-all duration-300`}
          style={{
            width: "6rem",
            left: activeTab === "users" ? "0px" : "6.5rem",
          }}
        />
      </div>

      {/* Contenido */}
      <div className="pt-4 transition-opacity duration-500">
        {activeTab === "users" && (
          <div className="animate-fadeIn">
            <UsersList currentUserRole={currentUserRole} />
          </div>
        )}

        {activeTab === "create" && (
          <div className="animate-fadeIn flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-md p-6 text-gray-700">
            <h2 className="text-xl font-semibold mb-4">Formulario de creación de usuario</h2>
            <p className="text-gray-500 text-center">
              Aquí irá el formulario para crear nuevos usuarios en el futuro.
            </p>
          </div>
        )}
      </div>

      {/* Animación CSS */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};
