import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Confirmación antes de una acción destructiva.
 * Borrar sin preguntar un puesto o una insignia es un error que se
 * lleva por delante datos de la cofradía.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  titulo,
  mensaje,
  textoConfirmar = "Eliminar",
  onConfirm,
  onCancel,
  loading = false,
}) => (
  <Modal
    isOpen={isOpen}
    titulo={titulo}
    onClose={onCancel}
    ancho="sm"
    pie={
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {loading ? "Eliminando..." : textoConfirmar}
        </button>
      </div>
    }
  >
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
      <p className="text-sm text-gray-700">{mensaje}</p>
    </div>
  </Modal>
);
