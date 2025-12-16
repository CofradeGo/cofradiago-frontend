import React, { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordFormProps {
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  onSubmit: (data: { newPassword: string; confirmPassword: string }) => void;
  onCancel: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  loading = false,
  error,
  success,
  onSubmit,
  onCancel,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validación de confirmación y coincidencia
  const matchError = useMemo(() => {
    if (!confirmPassword) return null;
    return newPassword !== confirmPassword ? "Las contraseñas no coinciden" : null;
  }, [newPassword, confirmPassword]);

  // Indicador de fortaleza simple
  const passwordStrength = useMemo(() => {
    if (!newPassword) return "";
    if (newPassword.length < 8) return "Débil";
    if (/[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)) return "Fuerte";
    return "Media";
  }, [newPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchError || !newPassword) return;
    onSubmit({ newPassword, confirmPassword });
  };

  return (
    <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      {/* Mensajes */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {matchError && <p className="text-red-500 text-sm">{matchError}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      {/* Nueva contraseña */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded p-2 w-full pr-10"
          disabled={loading || !!success}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Indicador de fortaleza */}
      {passwordStrength && (
        <p
          className={`text-sm ${
            passwordStrength === "Débil"
              ? "text-red-500"
              : passwordStrength === "Media"
                ? "text-yellow-500"
                : "text-green-500"
          }`}
        >
          Fortaleza: {passwordStrength}
        </p>
      )}

      {/* Confirmar contraseña */}
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border rounded p-2"
        disabled={loading || !!success}
      />

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={loading || !!success || !!matchError}
        className="bg-indigo-600 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Cambiando..." : "Cambiar contraseña"}
      </button>

      {/* Botón cancelar */}
      <button
        type="button"
        className="text-gray-500 mt-2 hover:underline"
        onClick={onCancel}
        disabled={loading}
      >
        Cancelar
      </button>
    </form>
  );
};
