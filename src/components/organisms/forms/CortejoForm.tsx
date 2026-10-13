import React, { useMemo, useState } from "react";
import { CampoTexto, ErrorFormulario } from "../../atoms/Campos";
import { Modal } from "../../atoms/Modal";
import type { Cortejo, CortejoInput } from "../../../types/Organizacion";

interface CortejoFormProps {
  isOpen: boolean;
  /** Si se pasa, el formulario edita; si es null, crea uno nuevo. */
  cortejo: Cortejo | null;
  loading?: boolean;
  errorServidor?: string | null;
  onClose: () => void;
  onSubmit: (input: CortejoInput) => Promise<void>;
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

export const CortejoForm: React.FC<CortejoFormProps> = ({
  isOpen,
  cortejo,
  loading = false,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  // El componente se monta de nuevo cada vez que se abre el modal
  // (el padre lo renderiza solo si isOpen y le pasa key), así que el
  // estado inicial basta: no hace falta sincronizarlo con un efecto.
  const [nombre, setNombre] = useState(() => cortejo?.nombre ?? "");
  const [tocado, setTocado] = useState<{ nombre?: boolean }>({});

  // La validación se deriva en cada render en vez de guardarse en
  // estado con un efecto: así no puede quedar desincronizada del valor.
  const errores = useMemo(() => validar(nombre), [nombre]);

  const editando = cortejo !== null;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTocado({ nombre: true });

    if (Object.keys(errores).length > 0) return;

    await onSubmit({ nombre: nombre.trim() });
  };

  return (
    <Modal
      isOpen={isOpen}
      titulo={editando ? "Editar cortejo" : "Nuevo cortejo"}
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
            form="form-cortejo"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : editando ? "Guardar cambios" : "Crear cortejo"}
          </button>
        </div>
      }
    >
      <form id="form-cortejo" onSubmit={enviar} noValidate>
        <ErrorFormulario mensaje={errorServidor} />

        <CampoTexto
          label="Nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => setTocado({ nombre: true })}
          error={tocado.nombre ? errores.nombre : undefined}
          placeholder="Cortejo Principal"
        />

        {/* El orden ya no se escribe a mano: se cambia arrastrando la
            fila en la tabla, y lo nuevo entra al final. */}
        <p className="-mt-2 text-sm text-gray-500">
          La posición en la marcha se cambia arrastrando la fila en la tabla. El cortejo nuevo se
          añadirá al final.
        </p>
      </form>
    </Modal>
  );
};
