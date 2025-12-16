// src/pages/UserPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { UsersList } from "../../components/organisms/UsersList";
import { CreateAuxUserSection } from "../../components/organisms/CreateAuxUserSection";

export const UsuariosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"users" | "create">("users");
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({});
  const usersTabRef = useRef<HTMLButtonElement>(null);
  const createTabRef = useRef<HTMLButtonElement>(null);

  const userStr = localStorage.getItem("user");
  const currentUserRole = userStr ? JSON.parse(userStr).role : "AUXILIAR";

  useEffect(() => {
    // Ajustar slider dinámicamente según la tab activa
    const activeRef = activeTab === "users" ? usersTabRef.current : createTabRef.current;
    if (activeRef) {
      setSliderStyle({
        width: activeRef.offsetWidth,
        left: activeRef.offsetLeft,
      });
    }
  }, [activeTab]);

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Tabs container */}
      <div className="flex justify-center border-b border-gray-200 relative overflow-x-auto no-scrollbar">
        {/* Tab: Usuarios */}
        <button
          ref={usersTabRef}
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-medium transition-colors duration-300 rounded-t-lg focus:outline-none ${
            activeTab === "users" ? "text-blue-700" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Usuarios
        </button>

        {/* Tab: Crear Usuario */}
        <button
          ref={createTabRef}
          onClick={() => setActiveTab("create")}
          className={`ml-4 px-6 py-3 font-medium transition-colors duration-300 rounded-t-lg focus:outline-none ${
            activeTab === "create" ? "text-blue-700" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Crear Usuario
        </button>

        {/* Slider animado */}
        <div
          className="absolute bottom-0 h-1 bg-blue-500 rounded transition-all duration-300"
          style={{ ...sliderStyle }}
        />
      </div>

      {/* Contenido */}
      <div className="pt-6 transition-opacity duration-500">
        {activeTab === "users" && (
          <div className="animate-fadeIn">
            <UsersList currentUserRole={currentUserRole} />
          </div>
        )}
        {activeTab === "create" && (
          <div className="animate-fadeIn">
            <CreateAuxUserSection currentUserRole={currentUserRole} />
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
          /* Quitar scrollbar horizontal invisible */
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};
