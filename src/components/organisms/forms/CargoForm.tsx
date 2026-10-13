import React, { useMemo, useState } from "react";
import { CampoTexto, ErrorFormulario } from "../../atoms/Campos";
import { Modal } from "../../atoms/Modal";
import type { Cargo } from "../../../types/Cargo";

interface CargoFormProps {
  isOpen: boolean;
  /** Si se pasa, el formulario edita; si es null, crea uno nuevo. */
  cargo: Cargo | null;
  loading?: boolean;
  errorServidor?: string | null;
  onClose: () => void;
  onSubmit: (nombre: string) => Promise<void>;
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

export const CargoForm: React.FC<CargoFormProps> = ({
  isOpen,
  cargo,
  loading = false,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  // El componente se monta de nuevo cada vez que se abre el modal
  // (el padre lo renderiza solo si isOpen y le pasa key), así que el
  // estado inicial basta: no hace falta sincronizarlo con un efecto.
  const [nombre, setNombre] = useState(() => cargo?.nombre ?? "");
  const [tocado, setTocado] = useState<{ nombre?: boolean }>({});

  // La validación se deriva en cada render en vez de guardarse en
  // estado con un efecto: así no puede quedar desincronizada del valor.
  const errores = useMemo(() => validar(nombre), [nombre]);

  const editando = cargo !== null;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTocado({ nombre: true });

    if (Object.keys(errores).length > 0) return;

    await onSubmit(nombre.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      titulo={editando ? "Editar cargo" : "Nuevo cargo"}
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
            form="form-cargo"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : editando ? "Guardar cambios" : "Crear cargo"}
          </button>
        </div>
      }
    >
      <form id="form-cargo" onSubmit={enviar} noValidate>
        <ErrorFormulario mensaje={errorServidor} />

        <CampoTexto
          label="Nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => setTocado({ nombre: true })}
          error={tocado.nombre ? errores.nombre : undefined}
          placeholder="Secretario"
          hint="Oficio que ocupa un hermano dentro de la junta directiva."
        />
      </form>
    </Modal>
  );
};
