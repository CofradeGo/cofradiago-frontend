import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { ToastContext } from "./ToastContext";
import type { ToastItem, ToastVariant } from "./ToastContext";

/**
 * Avisos flotantes (toast) sin dependencias externas.
 *
 * El proyecto no tiene librería de notificaciones, así que se resuelve
 * con un provider: lo que se guarda en un modal debe confirmarse en
 * algún sitio, o el usuario no sabe si ha funcionado.
 */

const DURACION_MS = 4000;

const ESTILOS: Record<ToastVariant, { icono: typeof Info; clase: string }> = {
  success: { icono: CheckCircle2, clase: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  error: { icono: AlertCircle, clase: "border-red-200 bg-red-50 text-red-800" },
  info: { icono: Info, clase: "border-indigo-200 bg-indigo-50 text-indigo-800" },
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const siguienteId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (variant: ToastVariant, mensaje: string) => {
      const id = siguienteId.current++;
      setToasts((prev) => [...prev, { id, variant, mensaje }]);
      window.setTimeout(() => dismiss(id), DURACION_MS);
    },
    [dismiss],
  );

  const valor = useMemo(
    () => ({
      success: (m: string) => push("success", m),
      error: (m: string) => push("error", m),
      info: (m: string) => push("info", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={valor}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
          {toasts.map((t) => {
            const { icono: Icono, clase } = ESTILOS[t.variant];
            return (
              <div
                key={t.id}
                role="status"
                className={`pointer-events-auto flex items-start gap-2 px-4 py-3 rounded-lg border shadow-lg ${clase}`}
              >
                <Icono className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="flex-1 text-sm">{t.mensaje}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 opacity-60 hover:opacity-100"
                  aria-label="Cerrar aviso"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};
