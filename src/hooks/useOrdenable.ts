import { useCallback, useState } from "react";
import { isAxiosError } from "axios";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const mensajeDe = (err: unknown, porDefecto: string): string => {
  if (isAxiosError<ApiErrorResponse>(err)) {
    return err.response?.data?.message ?? err.response?.data?.error ?? porDefecto;
  }
  if (err instanceof Error) return err.message;
  return porDefecto;
};

interface UseOrdenable<T extends { id: number; orden: number }> {
  /** Elementos en el orden que debe pintar la tabla. */
  items: T[];
  /** Gestor del `onDragEnd` de dnd-kit. */
  alSoltar: (evento: DragEndEvent) => void;
  /** Guardando el orden en el servidor. */
  guardando: boolean;
  /** Mensaje de error si el guardado falla. */
  errorOrden: string | null;
}

interface Opciones<T> {
  items: T[];
  /** Persiste el nuevo orden. Recibe los ids ya en su posición final. */
  onGuardarOrden: (ids: number[]) => Promise<void>;
  /** Vuelve a pedir los datos al servidor tras un fallo. */
  onError: () => void;
}

/**
 * Arrastrar y soltar para reordenar una tabla.
 *
 * Al soltar, la fila se queda en la nueva posición al instante y el
 * guardado va por detrás. Si el guardado falla se recarga la lista:
 * mejor mostrar el orden realmente guardado que fingir un cambio que
 * se ha perdido.
 */
export const useOrdenable = <T extends { id: number; orden: number }>({
  items,
  onGuardarOrden,
  onError,
}: Opciones<T>): UseOrdenable<T> => {
  const [guardando, setGuardando] = useState(false);
  const [errorOrden, setErrorOrden] = useState<string | null>(null);

  // Copia local durante el guardado: la fila cae ya en su sitio sin
  // esperar al servidor, y si el guardado falla se descarta.
  const [borrador, setBorrador] = useState<T[] | null>(null);

  const alSoltar = useCallback(
    async (evento: DragEndEvent) => {
      const { active, over } = evento;

      // Sin destino, o soltado en la misma fila: no hay nada que hacer.
      if (!over || active.id === over.id) return;

      const origen = items.findIndex((i) => i.id === active.id);
      const destino = items.findIndex((i) => i.id === over.id);
      if (origen === -1 || destino === -1) return;

      const movido = arrayMove(items, origen, destino);

      setBorrador(movido);
      setGuardando(true);
      setErrorOrden(null);

      try {
        await onGuardarOrden(movido.map((i) => i.id));
      } catch (err) {
        setErrorOrden(mensajeDe(err, "No se ha podido guardar el nuevo orden"));
        onError();
      } finally {
        setBorrador(null);
        setGuardando(false);
      }
    },
    [items, onGuardarOrden, onError],
  );

  return {
    items: borrador ?? items,
    alSoltar,
    guardando,
    errorOrden,
  };
};
