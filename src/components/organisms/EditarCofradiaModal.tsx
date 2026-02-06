// EditarCofradiaModal.tsx
import React, { useState, useEffect } from "react";
import type { Cofradia } from "../../types/Cofradia";
import { useCofradias } from "../../hooks/useCofradias";
import { isAxiosError } from "axios";

export interface EditarCofradiaModalProps {
  isOpen: boolean;
  cofradia: Cofradia;
  onClose: () => void;
  onSuccess?: () => void; // callback opcional
}

export const EditarCofradiaModal: React.FC<EditarCofradiaModalProps> = ({
  isOpen,
  cofradia,
  onClose,
  onSuccess,
}) => {
  const { updateCofradia } = useCofradias();

  const [nombre, setNombre] = useState(cofradia.nombre);
  const [anio, setAnio] = useState(cofradia.anio);
  const [tipo, setTipo] = useState(cofradia.tipo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Solo sincronizamos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setNombre(cofradia.nombre);
      setAnio(cofradia.anio);
      setTipo(cofradia.tipo);
      setError("");
    }
  }, [isOpen, cofradia]);

  // 🔹 Validación local antes de enviar
  const validate = (): string | null => {
    if (!nombre.trim()) return "El nombre es obligatorio";
    if (!anio || anio <= 0) return "El año es obligatorio y debe ser mayor que 0";
    if (!tipo.trim()) return "El tipo es obligatorio";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await updateCofradia(cofradia.id, { nombre, anio, tipo });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Error al actualizar la cofradía");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al actualizar la cofradía");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Editar Cofradía</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <label className="block mb-2">
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </label>

        <label className="block mb-2">
          Año
          <input
            type="number"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            className="border p-2 w-full rounded"
          />
        </label>

        <label className="block mb-4">
          Tipo
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </label>

        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
