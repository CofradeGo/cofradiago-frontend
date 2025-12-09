// src/components/molecules/UserCard.tsx
import React from "react";
import type { User } from "../../types/User";
import { User as UserIcon, Mail } from "lucide-react";

interface UserCardProps {
  user: User;
  currentUserRole: string;
  onDelete?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  currentUserRole,
  onDelete = () => {},
}) => {
  const isCurrentDMG = currentUserRole === "DMG" && user.role === "DMG";

  // Colores de rol con gradiente
  const roleGradient =
    user.role === "DMG"
      ? "bg-gradient-to-r from-blue-500 to-blue-700"
      : "bg-gradient-to-r from-green-400 to-green-600";

  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105 w-full">
      {/* Header usuario */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-gray-400" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-lg">{user.username}</span>
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Mail className="w-3 h-3" />
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      {/* Rol */}
      <span
        className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${roleGradient} mb-3`}
      >
        {user.role}
      </span>

      {/* Fecha de creación */}
      <div className="text-gray-400 text-xs mb-3">
        Creado: {new Date(user.createdAt).toLocaleDateString()}
      </div>

      {/* Botón eliminar solo */}
      <div className="flex justify-end mt-auto">
        <button
          onClick={() => onDelete(user)}
          disabled={isCurrentDMG}
          className={`px-3 py-1 rounded-lg text-white text-sm font-medium transition-all duration-300 ${
            isCurrentDMG
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg"
          }`}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
