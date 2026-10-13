import React, { useMemo, useState } from "react";
import { CampoTexto, ErrorFormulario } from "../../atoms/Campos";
import { Modal } from "../../atoms/Modal";
import type { Tramo } from "../../../hooks/useTramos";

export interface TramoInput {
  nombre: string;
}

interface TramoFormProps {
  isOpen: boolean;
  tramo: Tramo | null;
  /** Cortejo al que pertenece el tramo, solo para el texto de ayuda. */
  nombreCortejo?: string;
  loading?: boolean;
  errorServidor?: string | null;
  onClose: () => void;
  onSubmit: (input: TramoInput) => Promise<void>;
}

interface Errores {
  nombre?: string;
}

const validar = (nombre: string): Errores => {
  const errores: Errores = {};

  if (!nombre.trim()) {
    errores.nombre = "El nombre es obligatorio";
  } else if (nombre.trim().length < 3) {
    errores.nombre = "Debe tener al menos 3 caracteres";
  } else if (nombre.trim().length > 100) {
    errores.nombre = "No puede superar los 100 caracteres";
  }

  return errores;
};

export const TramoForm: React.FC<TramoFormProps> = ({
  isOpen,
  tramo,
  nombreCortejo,
  loading = false,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState(() => tramo?.nombre ?? "");
  const [tocado, setTocado] = useState<{ nombre?: boolean }>({});

  const errores = useMemo(() => validar(nombre), [nombre]);

  const editando = tramo !== null;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTocado({ nombre: true });

    if (Object.keys(errores).length > 0) return;

    await onSubmit({ nombre: nombre.trim() });
  };

  return (
    <Modal
      isOpen={isOpen}
      titulo={editando ? "Editar tramo" : "Nuevo tramo"}
      onClose={onClose}
      pie={
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-tramo"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : editando ? "Guardar cambios" : "Crear tramo"}
          </button>
        </div>
      }
    >
      <form id="form-tramo" onSubmit={enviar} noValidate>
        <ErrorFormulario mensaje={errorServidor} />

        <CampoTexto
          label="Nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => setTocado({ nombre: true })}
          error={tocado.nombre ? errores.nombre : undefined}
          placeholder="Tramo de la Cruz de Guía"
        />

        <p className="-mt-2 text-sm text-gray-500">
          {editando && nombreCortejo
            ? `Este tramo pertenece a "${nombreCortejo}". La posición en la marcha se cambia arrastrando la fila en la tabla.`
            : "La posición en la marcha se cambia arrastrando la fila en la tabla. El tramo nuevo se añadirá al final."}
        </p>
      </form>
    </Modal>
  );
};
