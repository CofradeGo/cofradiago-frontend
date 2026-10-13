import React from "react";
import { TablaGestional } from "./TablaGestional";
import type { Puesto } from "../../../types/Puesto";

interface PuestosTableProps {
  puestos: Puesto[];
  loading?: boolean;
  error?: string | null;
  onAnadir?: () => void;
  onEditar?: (puesto: Puesto) => void;
  onEliminar?: (puesto: Puesto) => void;
}

/** Listado de puestos de la cofradía con su código corto. */
export const PuestosTable: React.FC<PuestosTableProps> = ({
  puestos,
  loading,
  error,
  onAnadir,
  onEditar,
  onEliminar,
}) => (
  <TablaGestional<Puesto>
    titulo="Puestos"
    descripcion="Posiciones que ocupan los hermanos durante la procesión."
    filas={puestos}
    loading={loading}
    error={error}
    etiquetaAnadir="Nuevo puesto"
    onAnadir={onAnadir}
    onEditar={onEditar}
    onEliminar={onEliminar}
    vacio="No hay puestos definidos en esta cofradía."
    getKey={(p) => p.id}
    columnas={[
      {
        clave: "nombre",
        cabecera: "Nombre",
        render: (p) => <span className="font-medium text-gray-900">{p.nombre}</span>,
      },
      {
        clave: "codigo",
        cabecera: "Código",
        ocultaEnMovil: true,
        render: (p) =>
          p.codigo ? (
            <code className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700">
              {p.codigo}
            </code>
          ) : (
            <span className="text-gray-400">—</span>
          ),
      },
      {
        clave: "antiguedad",
        cabecera: "Alta",
        alinear: "derecha",
        ocultaEnMovil: true,
        render: (p) => (
          <span className="text-gray-500">{new Date(p.createdAt).toLocaleDateString("es-ES")}</span>
        ),
      },
    ]}
  />
);
