import React from "react";
import { Pencil, Trash2, Inbox, Loader2 } from "lucide-react";
import { getUserFromStorage } from "../../../utils/authToken";
import { FilaOrdenable } from "./FilaOrdenable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Announcements, DragEndEvent } from "@dnd-kit/core";

interface Columna<T> {
  clave: string;
  cabecera: string;
  render: (fila: T) => React.ReactNode;
  /** Alineación de la celda. */
  alinear?: "izquierda" | "centro" | "derecha";
  /** Oculta la columna en pantallas estrechas. */
  ocultaEnMovil?: boolean;
}

export interface Ordenable {
  /** Se llama al soltar una fila en otra posición. */
  alSoltar: (evento: DragEndEvent) => void;
  /** Hay un guardado en curso. */
  guardando?: boolean;
  /** Mensaje de error del último guardado. */
  errorOrden?: string | null;
  /**
   * Nombre de cada fila para los anuncios del lector de pantalla.
   * Sin esto se anuncia la posición, que es menos útil que el nombre.
   */
  getRotulo?: (id: number) => string;
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
  /** Si se indica, las filas se pueden arrastrar para reordenar. */
  ordenable?: Ordenable;
  /** Contenido bajo la cabecera y sobre la tabla (p. ej. un selector). */
  children?: React.ReactNode;
}

/**
 * Esqueleto común de las tablas de gestión (cortejos, puestos,
 * insignias, tramos).
 *
 * Centraliza lo que las cuatro comparten: cabecera con acción de
 * alta, estados de carga y error, la regla de que solo el DMG ve
 * botones de edición y borrado, y el arrastre para reordenar.
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
  ordenable,
  children,
}: TablaGestionalProps<T>) {
  const esDMG = getUserFromStorage()?.role === "DMG";

  // Reordenar es modificar: el AUXILIAR ni ve el asa ni puede arrastrar.
  const puedeOrdenar = esDMG && Boolean(ordenable) && filas.length > 1;

  const sensores = useSensors(
    // Margen pequeño: un clic normal no debe Interpretarse como arrastre.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    // Táctil: sin restricción de distancia, con un retardo corto para
    // para que el scroll siga funcionando en el móvil.
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
    // Teclado: se coge con Espacio y se mueve con las flechas.
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const alineacion = {
    izquierda: "text-left",
    centro: "text-center",
    derecha: "text-right",
  };

  const rotulo = ordenable?.getRotulo;
  const nombre = (id: number) => rotulo?.(id) ?? `la fila ${id}`;

  // Avisos en castellano para el lector de pantalla. Si no hay nombre
  // conocido se anuncia la posición, que es lo que hace dnd-kit.
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Se ha cogido ${nombre(active.id as number)}.`,
    onDragOver: ({ active, over }) => {
      // Al coger la fila, dnd-kit emite este aviso con ella misma como
      // destino. Repetirlo solo confundiría: se anuncia la toma.
      if (!over || over.id === active.id) return undefined;
      return `${nombre(active.id as number)} está sobre ${nombre(over.id as number)}.`;
    },
    onDragEnd: ({ active, over }) =>
      over
        ? `Se ha soltado ${nombre(active.id as number)} en la posición de ${nombre(over.id as number)}.`
        : `Se ha soltado ${nombre(active.id as number)}.`,
    onDragCancel: ({ active }) =>
      `Se ha cancelado el movimiento de ${nombre(active.id as number)}.`,
  };

  const screenReaderInstructions = {
    draggable:
      "Pulsa espacio para coger la fila. Usa las flechas arriba y abajo para moverla, y espacio otra vez para soltarla.",
  };

  const celdasDe = (fila: T) =>
    columnas.map((c) => (
      <td
        key={c.clave}
        className={`px-5 py-3 text-gray-700 ${alineacion[c.alinear ?? "izquierda"]} ${
          c.ocultaEnMovil ? "hidden md:table-cell" : ""
        }`}
      >
        {c.render(fila)}
      </td>
    ));

  const accionesDe = (fila: T) =>
    esDMG &&
    (onEditar || onEliminar) && (
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
    );

  const cuerpo = loading ? (
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
            {puedeOrdenar && <th className="w-8 px-2 py-3" aria-label="Orden" />}
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

        <SortableContext items={filas.map(getKey)} strategy={verticalListSortingStrategy}>
          <tbody className="divide-y divide-gray-100">
            {filas.map((fila, indice) =>
              puedeOrdenar ? (
                <FilaOrdenable
                  key={getKey(fila)}
                  id={getKey(fila)}
                  esUltimo={indice === filas.length - 1}
                >
                  {celdasDe(fila)}
                  {accionesDe(fila)}
                </FilaOrdenable>
              ) : (
                <tr key={getKey(fila)} className="hover:bg-gray-50/60 transition-colors">
                  {celdasDe(fila)}
                  {accionesDe(fila)}
                </tr>
              ),
            )}
          </tbody>
        </SortableContext>
      </table>
    </div>
  );

  const tabla = puedeOrdenar ? (
    <DndContext
      sensors={sensores}
      collisionDetection={closestCenter}
      onDragEnd={ordenable!.alSoltar}
      // dnd-kit anuncia el arrastre en inglés por defecto ("Draggable
      // item 17 was moved over..."). En una app en español, quien use
      // lector de pantalla oiría mensajes que no puede entender.
      accessibility={{ announcements, screenReaderInstructions }}
    >
      {cuerpo}
    </DndContext>
  ) : (
    cuerpo
  );

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <header className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>
            {descripcion && <p className="text-sm text-gray-500 mt-0.5">{descripcion}</p>}
          </div>

          {ordenable?.guardando && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Guardando orden
            </span>
          )}
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

      {ordenable?.errorOrden && (
        <div className="px-5 pt-4">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {ordenable.errorOrden}
          </p>
        </div>
      )}

      {children && <div className="px-5 pt-4">{children}</div>}

      {tabla}
    </section>
  );
}
