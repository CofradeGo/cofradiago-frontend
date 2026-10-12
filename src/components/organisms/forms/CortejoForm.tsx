import React, { useMemo, useState } from "react";
import { CampoTexto, ErrorFormulario } from "../../atoms/Campos";
import { Modal } from "../../atoms/Modal";
import type { Cortejo, CortejoInput } from "../../../types/Organizacion";

interface CortejoFormProps {
  isOpen: boolean;
  /** Si se pasa, el formulario edita; si es null, crea uno nuevo. */
  cortejo: Cortejo | null;
  /** Orden ya usado, para sugerir el siguiente al crear. */
  siguienteOrden?: number;
  loading?: boolean;
  errorServidor?: string | null;
  onClose: () => void;
  onSubmit: (input: CortejoInput) => Promise<void>;
}

interface Errores {
  nombre?: string;
  orden?: string;
}

const validar = (nombre: string, orden: string): Errores => {
  const errores: Errores = {};

  if (!nombre.trim()) {
    errores.nombre = "El nombre es obligatorio";
  } else if (nombre.trim().length < 3) {
    errores.nombre = "Debe tener al menos 3 caracteres";
  } else if (nombre.trim().length > 100) {
    errores.nombre = "No puede superar los 100 caracteres";
  }

  if (!orden.trim()) {
    errores.orden = "El orden es obligatorio";
  } else {
    const n = Number(orden);
    if (!Number.isInteger(n)) errores.orden = "Debe ser un número entero";
    else if (n < 1) errores.orden = "El orden empieza en 1";
    else if (n > 999) errores.orden = "Máximo 999";
  }

  return errores;
};

export const CortejoForm: React.FC<CortejoFormProps> = ({
  isOpen,
  cortejo,
  siguienteOrden = 1,
  loading = false,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  // El componente se monta de nuevo cada vez que se abre el modal
  // (el padre lo renderiza solo si isOpen y le pasa key), así que el
  // estado inicial basta: no hace falta sincronizarlo con un efecto.
  const [nombre, setNombre] = useState(() => cortejo?.nombre ?? "");
  const [orden, setOrden] = useState(() =>
    cortejo ? String(cortejo.orden) : String(siguienteOrden),
  );
  const [tocado, setTocado] = useState<{ nombre?: boolean; orden?: boolean }>({});

  // La validación se deriva en cada render en vez de guardarse en
  // estado con un efecto: así no puede quedar desincronizada del valor.
  // `tocado` decide si se muestra, para no marcar campos vacíos antes
  // de que el usuario los rellene.
  const errores = useMemo(() => validar(nombre, orden), [nombre, orden]);

  const editando = cortejo !== null;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTocado({ nombre: true, orden: true });

    if (Object.keys(errores).length > 0) return;

    await onSubmit({ nombre: nombre.trim(), orden: Number(orden) });
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
          onBlur={() => setTocado((t) => ({ ...t, nombre: true }))}
          error={tocado.nombre ? errores.nombre : undefined}
          placeholder="Cortejo Principal"
        />

        <CampoTexto
          label="Orden en la marcha"
          required
          type="number"
          min={1}
          max={999}
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, orden: true }))}
          error={tocado.orden ? errores.orden : undefined}
          hint="Define la posición del cortejo en la procesión"
        />
      </form>
    </Modal>
  );
};
