// src/components/molecules/DeleteUserModal.tsx
import React, { useState } from "react";
import { useUsuario } from "../../hooks/useUser";

interface DeleteUserModalProps {
  isOpen: boolean;
  userId: number;
  username: string;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  userId,
  username,
  onClose,
  onSuccess,
}) => {
  const { deleteUsuario } = useUsuario();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const msg = await deleteUsuario(userId);
      onSuccess(msg);
      onClose();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error al eliminar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmar eliminación</h2>
        <p className="text-gray-600 mb-6">
          ¿Seguro que quieres eliminar al usuario <span className="font-medium">{username}</span>?
        </p>

        {error && <p className="text-red-600 mb-4 text-sm font-medium">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};
