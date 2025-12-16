import React, { useState } from "react";
import { useForgotPassword } from "../../hooks/useForgotPassword";

interface ForgotPasswordFormProps {
  domain: string;
  onBack: () => void; // callback para volver al login
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ domain, onBack }) => {
  const [username, setUsername] = useState("");

  // 🔹 Hook de forgot password
  const { loading, error, success, sendForgotPassword } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!domain) {
      alert("No se pudo determinar la hermandad. Revisa la URL.");
      return;
    }

    if (!username.trim()) {
      alert("Introduce tu nombre de usuario.");
      return;
    }

    await sendForgotPassword({ username: username.trim(), domain });
  };

  return (
    <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      {/* Mensajes */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      {/* Input usuario */}
      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border rounded p-2"
        disabled={loading || !!success}
      />

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={loading || !!success || !domain}
        className="bg-indigo-600 text-white p-2 rounded"
      >
        {loading ? "Enviando..." : "Enviar instrucciones"}
      </button>

      {/* Botón cancelar */}
      <button type="button" className="text-gray-500 mt-2 hover:underline" onClick={onBack}>
        Cancelar
      </button>
    </form>
  );
};
