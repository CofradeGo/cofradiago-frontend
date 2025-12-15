import React, { useState } from "react";

interface ForgotPasswordFormProps {
  domain: string;
  onBack: () => void; // callback para volver al login
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ domain, onBack }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await fetch(`/api/v1/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, domain }),
      });
      setMessage(
        "Si el usuario existe, se ha enviado un email con instrucciones para recuperar la contraseña",
      );
    } catch {
      setError("Ocurrió un error, inténtalo de nuevo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border rounded p-2"
        disabled={loading}
      />

      <button type="submit" disabled={loading} className="bg-indigo-600 text-white p-2 rounded">
        {loading ? "Enviando..." : "Enviar instrucciones"}
      </button>

      <button type="button" className="text-gray-500 mt-2 hover:underline" onClick={onBack}>
        Cancelar
      </button>
    </form>
  );
};
