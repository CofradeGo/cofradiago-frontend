// src/components/molecules/ChangePasswordModal/ChangePasswordModal.tsx
import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useUsuario } from "../../hooks/useUser";
import { Eye, EyeOff, XCircle, Loader2 } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void; // Callback para mostrar mensaje flotante
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { changePassword } = useUsuario();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);

  useEffect(() => {
    if (!confirmPassword) {
      setPasswordMatch(null);
    } else {
      setPasswordMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La nueva contraseña y la confirmación no coinciden");
      return;
    }

    try {
      setLoading(true);
      await changePassword({ oldPassword, newPassword });

      // Reset de campos
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMatch(null);

      // Cerrar modal
      onClose();

      // Mostrar mensaje flotante de éxito
      if (onSuccess) {
        onSuccess("Contraseña cambiada correctamente");
        // Opcional: se puede ocultar automáticamente en 1s dentro del callback
      }
    } catch (err) {
      let msg = "Error al cambiar la contraseña";
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        msg = axiosErr.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-96 p-6 transform transition-all scale-100">
        <h2 className="text-2xl font-semibold mb-5 text-gray-800">Cambiar contraseña</h2>

        {error && (
          <div className="flex items-center gap-2 mb-2 text-red-500 animate-fadeIn">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Contraseña actual"
            value={oldPassword}
            onChange={setOldPassword}
            show={showOld}
            setShow={setShowOld}
          />
          <PasswordInput
            label="Nueva contraseña"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            setShow={setShowNew}
          />
          <PasswordInput
            label="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
            borderColor={
              passwordMatch === null
                ? "border-gray-300"
                : passwordMatch
                  ? "border-green-500"
                  : "border-red-500"
            }
          />

          {passwordMatch !== null && (
            <p
              className={`text-sm ${passwordMatch ? "text-green-500" : "text-red-500"} transition-colors`}
            >
              {passwordMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 justify-center"
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  show: boolean;
  setShow: (val: boolean) => void;
  borderColor?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  show,
  setShow,
  borderColor,
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={show ? "text" : "password"}
        className={`mt-1 block w-full rounded-md p-2 pr-10 border ${borderColor || "border-gray-300"} transition-colors`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="absolute right-2 top-8 text-gray-500"
        onClick={() => setShow(!show)}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};
