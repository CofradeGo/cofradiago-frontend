import React from "react";
import { Pencil, Trash2, Inbox } from "lucide-react";
import { getUserFromStorage } from "../../../utils/authToken";

interface Columna<T> {
  clave: string;
  cabecera: string;
  render: (fila: T) => React.ReactNode;
  /** Alineación de la celda. */
  alinear?: "izquierda" | "centro" | "derecha";
  /** Oculta la columna en pantallas estrechas. */
  ocultaEnMovil?: boolean;
}

interface TablaGestionalProps<T> {
  titulo: string;
  descripcion?: string;
  filas: T[];
  columnas: Columna<T>[];
  loading?: boolean;
  error?: string | null;
  /** Texto del botón de alta. Solo se muestra a DMG. */
  etiquetaAnadir?: string;
  onAnadir?: () => void;
  onEditar?: (fila: T) => void;
  onEliminar?: (fila: T) => void;
  /** Mensaje cuando la lista está vacía. */
  vacio?: string;
  getKey: (fila: T) => number;
}

/**
 * Esqueleto común de las tablas de gestión (cortejos, puestos,
 * insignias).
 *
 * Centraliza lo que las tres comparten: cabecera con acción de alta,
 * estados de carga y error, y la regla de que solo el DMG ve botones
 * de edición y borrado. El AUXILIAR consulta, pero no modifica.
 */
export function TablaGestional<T>({
  titulo,
  descripcion,
  filas,
  columnas,
  loading = false,
  error = null,
  etiquetaAnadir = "Añadir",
  onAnadir,
  onEditar,
  onEliminar,
  vacio = "Todavía no hay elementos registrados.",
  getKey,
}: TablaGestionalProps<T>) {
  const usuario = getUserFromStorage();
  const esDMG = usuario?.role === "DMG";

  const alineacion = { izquierda: "text-left", centro: "text-center", derecha: "text-right" };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <header className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>
          {descripcion && <p className="text-sm text-gray-500 mt-0.5">{descripcion}</p>}
        </div>

        {esDMG && onAnadir && (
          <button
            onClick={onAnadir}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            + {etiquetaAnadir}
          </button>
        )}
      </header>

      {loading ? (
        <div className="px-5 py-10 text-center">
          <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
          <p className="mt-3 text-sm text-gray-500">Cargando...</p>
        </div>
      ) : error ? (
        <div className="px-5 py-6">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        </div>
      ) : filas.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <Inbox className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">{vacio}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {columnas.map((c) => (
                  <th
                    key={c.clave}
                    className={`px-5 py-3 font-medium ${alineacion[c.alinear ?? "izquierda"]} ${
                      c.ocultaEnMovil ? "hidden md:table-cell" : ""
                    }`}
                  >
                    {c.cabecera}
                  </th>
                ))}
                {esDMG && (onEditar || onEliminar) && (
                  <th className="px-5 py-3 font-medium text-right">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filas.map((fila) => (
                <tr key={getKey(fila)} className="hover:bg-gray-50/60 transition-colors">
                  {columnas.map((c) => (
                    <td
                      key={c.clave}
                      className={`px-5 py-3 text-gray-700 ${alineacion[c.alinear ?? "izquierda"]} ${
                        c.ocultaEnMovil ? "hidden md:table-cell" : ""
                      }`}
                    >
                      {c.render(fila)}
                    </td>
                  ))}

                  {esDMG && (onEditar || onEliminar) && (
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {onEditar && (
                          <button
                            onClick={() => onEditar(fila)}
                            title="Editar"
                            aria-label={`Editar ${titulo.toLowerCase()}`}
                            className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {onEliminar && (
                          <button
                            onClick={() => onEliminar(fila)}
                            title="Eliminar"
                            aria-label={`Eliminar ${titulo.toLowerCase()}`}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
