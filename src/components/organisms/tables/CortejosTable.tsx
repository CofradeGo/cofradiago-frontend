import React from "react";
import { TablaGestional } from "./TablaGestional";
import type { Cortejo } from "../../../types/Organizacion";
import type { Ordenable } from "./TablaGestional";

interface CortejosTableProps {
  cortejos: Cortejo[];
  loading?: boolean;
  error?: string | null;
  onAnadir?: () => void;
  onEditar?: (cortejo: Cortejo) => void;
  onEliminar?: (cortejo: Cortejo) => void;
  /** Arrastrar una fila cambia la posición del cortejo en la marcha. */
  ordenable?: Ordenable;
}

/** Listado de los cortejos de la cofradía, ordenados por posición en la marcha. */
export const CortejosTable: React.FC<CortejosTableProps> = ({
  cortejos,
  loading,
  error,
  onAnadir,
  onEditar,
  onEliminar,
  ordenable,
}) => (
  <TablaGestional<Cortejo>
    titulo="Cortejos"
    descripcion="Cada cortejo agrupa los puestos e insignias de una parte de la procesión."
    filas={cortejos}
    loading={loading}
    error={error}
    etiquetaAnadir="Nuevo cortejo"
    onAnadir={onAnadir}
    onEditar={onEditar}
    onEliminar={onEliminar}
    ordenable={ordenable}
    vacio="No hay cortejos definidos en esta cofradía."
    getKey={(c) => c.id}
    columnas={[
      {
        clave: "orden",
        cabecera: "Orden",
        alinear: "centro",
        ocultaEnMovil: false,
        render: (c) => (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
            {c.orden}
          </span>
        ),
      },
      {
        clave: "nombre",
        cabecera: "Nombre",
        render: (c) => <span className="font-medium text-gray-900">{c.nombre}</span>,
      },
      {
        clave: "creado",
        cabecera: "Creado",
        alinear: "derecha",
        ocultaEnMovil: true,
        render: (c) => (
          <span className="text-gray-500">{new Date(c.createdAt).toLocaleDateString("es-ES")}</span>
        ),
      },
    ]}
  />
);
