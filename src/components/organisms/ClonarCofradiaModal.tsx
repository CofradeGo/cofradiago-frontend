// ClonarCofradiaModal.tsx
import React, { useState, useEffect } from "react";
import type { Cofradia } from "../../types/Cofradia";
import { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cofradia: Cofradia;
  onConfirmClone: (newCofradiaData: { nombre: string; anio: number }) => Promise<void>;
  errorMessage?: string;
  loading?: boolean;
}

export const ClonarCofradiaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cofradia,
  onConfirmClone,
  errorMessage,
  loading,
}) => {
  const [nuevoAnio, setNuevoAnio] = useState<number>(cofradia.anio + 1);
  const [localError, setLocalError] = useState<string>("");

  // Reinicia estado al abrir
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => {
        setLocalError("");
        // Si viene del histórico dejamos vacío para UX
        setNuevoAnio(cofradia.estado === "CERRADA" ? NaN : cofradia.anio + 1);
      }, 0);
      return () => clearTimeout(id);
    }
  }, [isOpen, cofradia]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isNaN(nuevoAnio)) {
      setLocalError("Debes indicar un año válido");
      return;
    }
    if (nuevoAnio === cofradia.anio) {
      setLocalError("El año debe ser diferente al de la cofradía original.");
      return;
    }
    onConfirmClone({ nombre: cofradia.nombre, anio: nuevoAnio }).catch((err: unknown) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setLocalError(err.response.data.message);
      } else if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError("Error desconocido al clonar la cofradía.");
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg w-[400px] p-6 relative">
        <h2 className="text-xl font-bold mb-4">Clonar Cofradía</h2>
        <p className="text-gray-700 mb-4">
          Estás a punto de clonar la cofradía{" "}
          <strong>
            {cofradia.nombre} ({cofradia.anio})
          </strong>
          . La cofradía original se marcará como cerrada y se creará una nueva cofradía abierta.
        </p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Año de la nueva cofradía:</label>
          <input
            type="number"
            value={isNaN(nuevoAnio) ? "" : nuevoAnio}
            min={cofradia.anio + 1}
            onChange={(e) => setNuevoAnio(Number(e.target.value))}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {(localError || errorMessage) && (
            <p className="text-red-600 mt-1">{localError || errorMessage}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Clonando..." : "Clonar"}
          </button>
        </div>
      </div>
    </div>
  );
};
