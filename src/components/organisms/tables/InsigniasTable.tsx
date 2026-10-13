import React from "react";
import { TablaGestional } from "./TablaGestional";
import type { Insignia } from "../../../types/Organizacion";

interface InsigniasTableProps {
  insignias: Insignia[];
  loading?: boolean;
  error?: string | null;
  onAnadir?: () => void;
  onEditar?: (insignia: Insignia) => void;
  onEliminar?: (insignia: Insignia) => void;
}

/** Resuelve los nombres de los cortejos a los que pertenece la insignia. */
const nombreCortejo = (insignia: Insignia): string => {
  if (insignia.cortejos.length === 0) return "Sin asignar";
  return insignia.cortejos.map((c) => c.nombre).join(", ");
};

/** Listado de insignias con su cortejo asociado. */
export const InsigniasTable: React.FC<InsigniasTableProps> = ({
  insignias,
  loading,
  error,
  onAnadir,
  onEditar,
  onEliminar,
}) => (
  <TablaGestional<Insignia>
    titulo="Insignias"
    descripcion="Estandartes, cruces, faroles y demás símbolos de la hermandad."
    filas={insignias}
    loading={loading}
    error={error}
    etiquetaAnadir="Nueva insignia"
    onAnadir={onAnadir}
    onEditar={onEditar}
    onEliminar={onEliminar}
    vacio="No hay insignias registradas en esta cofradía."
    getKey={(i) => i.id}
    columnas={[
      {
        clave: "nombre",
        cabecera: "Nombre",
        render: (i) => <span className="font-medium text-gray-900">{i.nombre}</span>,
      },
      {
        clave: "descripcion",
        cabecera: "Descripción",
        ocultaEnMovil: true,
        render: (i) => (
          <span className="text-gray-600">
            {i.descripcion || <span className="text-gray-400">—</span>}
          </span>
        ),
      },
      {
        clave: "cortejo",
        cabecera: "Cortejo",
        ocultaEnMovil: true,
        render: (i) => (
          <span className={i.cortejos.length > 0 ? "text-gray-700" : "text-gray-400 italic"}>
            {nombreCortejo(i)}
          </span>
        ),
      },
    ]}
  />
);
