import React, { useMemo, useState } from "react";
import { CampoTexto, ErrorFormulario } from "../../atoms/Campos";
import { Modal } from "../../atoms/Modal";
import type { Puesto } from "../../../types/Puesto";

export interface PuestoInput {
  nombre: string;
  codigo?: string;
}

interface PuestoFormProps {
  isOpen: boolean;
  puesto: Puesto | null;
  loading?: boolean;
  errorServidor?: string | null;
  onClose: () => void;
  onSubmit: (input: PuestoInput) => Promise<void>;
}

interface Errores {
  nombre?: string;
  codigo?: string;
}

const validar = (nombre: string, codigo: string): Errores => {
  const errores: Errores = {};

  if (!nombre.trim()) {
    errores.nombre = "El nombre es obligatorio";
  } else if (nombre.trim().length < 3) {
    errores.nombre = "Debe tener al menos 3 caracteres";
  }

  // El código es opcional, pero si se escribe debe tener sentido:
  // es la referencia corta que se usa en listas impresas.
  if (codigo.trim()) {
    if (codigo.trim().length > 20) {
      errores.codigo = "No puede superar los 20 caracteres";
    } else if (!/^[A-Za-z0-9._-]+$/.test(codigo.trim())) {
      errores.codigo = "Solo letras, números, punto, guion y guion bajo";
    }
  }

  return errores;
};

export const PuestoForm: React.FC<PuestoFormProps> = ({
  isOpen,
  puesto,
  loading = false,
  errorServidor,
  onClose,
  onSubmit,
}) => {
  // El componente se monta de nuevo cada vez que se abre el modal
  // (el padre lo renderiza solo si isOpen y le pasa key), así que el
  // estado inicial basta: no hace falta sincronizarlo con un efecto.
  const [nombre, setNombre] = useState(() => puesto?.nombre ?? "");
  const [codigo, setCodigo] = useState(() => puesto?.codigo ?? "");
  const [tocado, setTocado] = useState<{ nombre?: boolean; codigo?: boolean }>({});

  // La validación se deriva en cada render en vez de guardarse en
  // estado con un efecto: así no puede quedar desincronizada del valor.
  const errores = useMemo(() => validar(nombre, codigo), [nombre, codigo]);

  const editando = puesto !== null;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTocado({ nombre: true, codigo: true });

    if (Object.keys(errores).length > 0) return;

    await onSubmit({
      nombre: nombre.trim(),
      ...(codigo.trim() ? { codigo: codigo.trim() } : {}),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      titulo={editando ? "Editar puesto" : "Nuevo puesto"}
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
            form="form-puesto"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : editando ? "Guardar cambios" : "Crear puesto"}
          </button>
        </div>
      }
    >
      <form id="form-puesto" onSubmit={enviar} noValidate>
        <ErrorFormulario mensaje={errorServidor} />

        <CampoTexto
          label="Nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onBlur={() => setTocado((t) => ({ ...t, nombre: true }))}
          error={tocado.nombre ? errores.nombre : undefined}
          placeholder="Puesto de Trono (derecha)"
        />

        <CampoTexto
          label="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          onBlur={() => setTocado((t) => ({ ...t, codigo: true }))}
          error={tocado.codigo ? errores.codigo : undefined}
          placeholder="TRON-D"
          hint="Opcional. Referencia corta para listas impresas."
        />
      </form>
    </Modal>
  );
};
