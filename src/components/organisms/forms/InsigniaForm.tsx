import React, { useMemo, useState } from "react";
import { CampoTexto, CampoArea, CampoSelect, ErrorFormulario } from "../../atoms/Campos";
import { Modal } from "../../atoms/Modal";
import type { Cortejo, Insignia, InsigniaInput } from "../../../types/Organizacion";

interface InsigniaFormProps {
  isOpen: boolean;
  insignia: Insignia | null;
  cortejos: Cortejo[];
  loading?: boolean;
  errorServidor?: string | null;
  onClose: () => void;
  onSubmit: (input: InsigniaInput) => Promise<void>;
}

interface Errores {
  nombre?: string;
  descripcion?: string;
}

const validar = (nombre: string, descripcion: string): Errores => {
  const errores: Errores = {};

  if (!nombre.trim()) {
    errores.nombre = "El nombre es obligatorio";
  } else if (nombre.trim().length < 3) {
    errores.nombre = "Debe tener al menos 3 caracteres";
  }

  if (descripcion.trim().length > 500) {
    errores.descripcion = "No puede superar los 500 caracteres";
  }

  return errores;
};

export const InsigniaForm: React.FC<InsigniaFormProps> = ({
  isOpen,
  insignia,
  cortejos,
  loading = false,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  // El componente se monta de nuevo cada vez que se abre el modal
  // (el padre lo renderiza solo si isOpen y le pasa key), así que el
  // estado inicial basta: no hace falta sincronizarlo con un efecto.
  const [nombre, setNombre] = useState(() => insignia?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(() => insignia?.descripcion ?? "");
  const [cortejoId, setCortejoId] = useState(() => insignia?.cortejos[0]?.id?.toString() ?? "");
  const [tocado, setTocado] = useState<{ nombre?: boolean; descripcion?: boolean }>({});

  // La validación se deriva en cada render en vez de guardarse en
  // estado con un efecto: así no puede quedar desincronizada del valor.
  const errores = useMemo(() => validar(nombre, descripcion), [nombre, descripcion]);

  const editando = insignia !== null;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTocado({ nombre: true, descripcion: true });

    if (Object.keys(errores).length > 0) return;

    await onSubmit({
      nombre: nombre.trim(),
      ...(descripcion.trim() ? { descripcion: descripcion.trim() } : {}),
      cortejoId: cortejoId ? Number(cortejoId) : null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      titulo={editando ? "Editar insignia" : "Nueva insignia"}
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
            form="form-insignia"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : editando ? "Guardar cambios" : "Crear insignia"}
          </button>
        </div>
      }
    >
      <form id="form-insignia" onSubmit={enviar} noValidate>
        <ErrorFormulario mensaje={errorServidor} />

        <CampoTexto
          label="Nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, nombre: true }))}
          error={tocado.nombre ? errores.nombre : undefined}
          placeholder="Estandarte Mayor"
        />

        <CampoArea
          label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, descripcion: true }))}
          error={tocado.descripcion ? errores.descripcion : undefined}
          placeholder="Estandarte principal de la hermandad"
        />

        <CampoSelect
          label="Cortejo"
          value={cortejoId}
          onChange={(e) => setCortejoId(e.target.value)}
          placeholder="Sin asignar"
          opciones={cortejos.map((c) => ({ value: String(c.id), label: c.nombre }))}
          hint="Opcional. Indica a qué cortejo pertenece la insignia."
        />
      </form>
    </Modal>
  );
};
