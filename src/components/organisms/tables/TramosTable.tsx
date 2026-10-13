import React from "react";
import { TablaGestional } from "./TablaGestional";
import type { Ordenable } from "./TablaGestional";
import type { Tramo } from "../../../hooks/useTramos";

interface TramosTableProps {
  tramos: Tramo[];
  loading?: boolean;
  error?: string | null;
  onAnadir?: () => void;
  onEditar?: (tramo: Tramo) => void;
  onEliminar?: (tramo: Tramo) => void;
  /** Arrastrar una fila cambia la posición del tramo en la marcha. */
  ordenable?: Ordenable;
  /** Selector de cortejo, si la tabla los muestra. */
  children?: React.ReactNode;
}

/** Listado de los tramos de un cortejo, ordenados por posición en la marcha. */
export const TramosTable: React.FC<TramosTableProps> = ({
  tramos,
  loading,
  error,
  onAnadir,
  onEditar,
  onEliminar,
  ordenable,
  children,
}) => (
  <TablaGestional<Tramo>
    titulo="Tramos"
    descripcion="Grupos de hermanos que forman el cortejo, en orden de marcha."
    filas={tramos}
    loading={loading}
    error={error}
    etiquetaAnadir="Nuevo tramo"
    onAnadir={onAnadir}
    onEditar={onEditar}
    onEliminar={onEliminar}
    ordenable={ordenable}
    vacio="Este cortejo todavía no tiene tramos definidos."
    getKey={(t) => t.id}
    columnas={[
      {
        clave: "orden",
        cabecera: "Posición",
        alinear: "centro",
        render: (t) => (
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
            {t.orden}
          </span>
        ),
      },
      {
        clave: "nombre",
        cabecera: "Nombre",
        render: (t) => <span className="font-medium text-gray-900">{t.nombre}</span>,
      },
    ]}
  >
    {children}
  </TablaGestional>
);
