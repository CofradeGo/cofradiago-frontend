// src/components/molecules/ProfileCard.tsx
import React from "react";

interface ProfileCardProps {
  username: string;
  email: string;
  hermandadName: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ username, email, hermandadName }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-md mx-auto mt-10">
      {/* Encabezado: Nombre de la Hermandad */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">{hermandadName}</h2>

      {/* Icono de usuario */}
      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl mb-6">
        {username.charAt(0).toUpperCase()}
      </div>

      {/* Información del usuario */}
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold text-gray-800">{username}</p>
        <p className="text-gray-600">{email}</p>
      </div>

      {/* Futuro botón de Editar */}
      {
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Editar perfil
        </button>
      }
    </div>
  );
};
