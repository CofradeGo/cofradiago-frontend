import React from "react";
import { TablaGestional } from "./TablaGestional";
import type { Cargo } from "../../../types/Cargo";

interface CargosTableProps {
  cargos: Cargo[];
  loading?: boolean;
  error?: string | null;
  onAnadir?: () => void;
  onEditar?: (cargo: Cargo) => void;
  onEliminar?: (cargo: Cargo) => void;
}

/**
 * Listado de los cargos de la cofradía, los oficios de la junta
 * directiva. No tiene arrastre porque no hay ningún campo de orden:
 * aquí importa quién ocupa qué cargo, no la secuencia.
 */
export const CargosTable: React.FC<CargosTableProps> = ({
  cargos,
  loading,
  error,
  onAnadir,
  onEditar,
  onEliminar,
}) => (
  <TablaGestional<Cargo>
    titulo="Cargos"
    descripcion="Oficios que ocupan los hermanos dentro de la junta directiva."
    filas={cargos}
    loading={loading}
    error={error}
    etiquetaAnadir="Nuevo cargo"
    onAnadir={onAnadir}
    onEditar={onEditar}
    onEliminar={onEliminar}
    vacio="No hay cargos definidos en esta cofradía."
    getKey={(c) => c.id}
    columnas={[
      {
        clave: "nombre",
        cabecera: "Cargo",
        render: (c) => <span className="font-medium text-gray-900">{c.nombre}</span>,
      },
      {
        clave: "alta",
        cabecera: "Alta",
        alinear: "derecha",
        ocultaEnMovil: true,
        render: (c) => (
          <span className="text-gray-500">{new Date(c.createdAt).toLocaleDateString("es-ES")}</span>
        ),
      },
    ]}
  />
);
