// src/components/molecules/EditUserModal/EditUserModal.tsx
import React, { useState, useEffect, useRef } from "react";
import { useUsuario } from "../../hooks/useUser";
import type { User } from "../../types/User";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUsername: string;
  initialEmail: string;
  onUserUpdated: (updatedUser: User | null) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  initialUsername,
  initialEmail,
  onUserUpdated,
}) => {
  const { updateUsuario } = useUsuario();

  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  /* -------------------- Cerrar con click fuera -------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!loading) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, loading, onClose]);

  /* ------------------------- Cerrar con ESC ------------------------ */
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, loading, onClose]);

  /* ---------------------- Reset al abrir modal --------------------- */
  useEffect(() => {
    if (isOpen) {
      setUsername(initialUsername);
      setEmail(initialEmail);
      setError(null);
    }
  }, [isOpen, initialUsername, initialEmail]);

  /* --------------------------- Submit ------------------------------ */
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUsuario({
        username,
        email,
      });

      onUserUpdated(updatedUser); // PASA User | null, compatible 100%
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error al actualizar usuario");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  /* ----------------------- Render modal ---------------------------- */
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-7 relative animate-fadeIn"
      >
        <h2 className="text-2xl font-semibold mb-5 text-gray-800">Editar perfil</h2>

        {error && (
          <p className="text-red-500 bg-red-100 px-3 py-2 rounded mb-4 border border-red-300">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition disabled:opacity-50"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 
                       transition disabled:cursor-not-allowed"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white 
                       hover:bg-blue-700 transition disabled:opacity-50 
                       disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
};
