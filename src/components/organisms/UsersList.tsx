// src/components/organisms/UsersList.tsx
import React, { useState } from "react";
import { useUsuario } from "../../hooks/useUser";
import { UserCard } from "../molecules/UserCard";
import type { User } from "../../types/User";
import { DeleteUserModal } from "../molecules/DeleteUserModal";

interface UsersListProps {
  currentUserRole: string;
}

export const UsersList: React.FC<UsersListProps> = ({ currentUserRole }) => {
  const { users, loading, error, refetchUsers, user: currentUser } = useUsuario();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!users || users.length === 0) return <div>No hay usuarios registrados.</div>;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  // Abrir modal de eliminar
  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) return; // nunca se puede eliminar a sí mismo
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Grid responsive premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
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

      {/* Modal de confirmación de eliminación */}
      {userToDelete && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          userId={userToDelete.id}
          username={userToDelete.username}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={(msg) => {
            console.log(msg);
            refetchUsers();
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
