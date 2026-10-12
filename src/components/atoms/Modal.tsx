import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  titulo: string;
  onClose: () => void;
  children: ReactNode;
  /** Pie con los botones de acción. */
  pie?: ReactNode;
  ancho?: "sm" | "md" | "lg";
}

const ANCHOS = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

/**
 * Modal base con cierre por Escape, por clic en el fondo y bloqueo del
 * scroll. Sin esto, cada pantalla reimplementaría el comportamiento y
 * lo haría de forma ligeramente distinta.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  titulo,
  onClose,
  children,
  pie,
  ancho = "md",
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Evita que la página siga desplazándose detrás del modal.
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflowPrevio;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`w-full ${ANCHOS[ancho]} bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{titulo}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="px-6 py-4 overflow-y-auto">{children}</div>

        {pie && <footer className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">{pie}</footer>}
      </div>
    </div>,
    document.body,
  );
};
