import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface FilaOrdenableProps {
  id: number;
  children: React.ReactNode;
  /** Última fila: el asa anuncia que se sube, no que se baja. */
  esUltimo: boolean;
}

/**
 * Fila que se puede arrastrar para cambiar su posición.
 *
 * El asa es a la vez punto de arrastre y botón accesible: con teclado
 * se coge con Espacio y se mueve con las flechas. Es el comportamiento
 * estándar de @dnd-kit y evita reimplementar los anuncios para
 * lectores de pantalla.
 */
export const FilaOrdenable: React.FC<FilaOrdenableProps> = ({ id, children, esUltimo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`hover:bg-gray-50/60 transition-colors ${isDragging ? "opacity-40" : ""}`}
    >
      <td className="w-8 pl-3">
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={
            esUltimo ? "Arrastrar para subir en la lista" : "Arrastrar para cambiar de posición"
          }
          className="cursor-grab text-gray-300 hover:text-gray-500 active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      {children}
    </tr>
  );
};
