import { useContext, useMemo } from "react";
import { ToastContext } from "./ToastContext";
import type { ToastContextValue } from "./ToastContext";

/**
 * Feedback visual tras guardar o borrar.
 *
 * Si se usa fuera del provider no rompe la app: en ese caso los avisos
 * simplemente no se muestran.
 */
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);

  const noop = useMemo<ToastContextValue>(
    () => ({ success: () => {}, error: () => {}, info: () => {} }),
    [],
  );

  return ctx ?? noop;
};
