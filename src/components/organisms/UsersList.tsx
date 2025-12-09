// src/components/organisms/UsersList.tsx
import React, { useState } from "react";
import { useUsuario } from "../../hooks/useUser";
import { UserCard } from "../molecules/UserCard";
import type { User } from "../../types/User";

interface UsersListProps {
  currentUserRole: string;
  handleEdit?: (user: User) => void;
  handleDelete?: (user: User) => void;
}

export const UsersList: React.FC<UsersListProps> = ({
  currentUserRole,
  handleDelete = () => {},
}) => {
  const { users, loading, error } = useUsuario();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!users || users.length === 0) return <div>No hay usuarios registrados.</div>;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-6">
      {/* Grid responsive premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {currentUsers.map((user: User) => (
          <UserCard
            key={user.id}
            user={user}
            currentUserRole={currentUserRole}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Paginación solo si hay más de 1 página */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-1 rounded-lg font-medium transition-colors duration-200 ${
                page === currentPage
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
