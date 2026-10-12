import { createContext } from "react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  variant: ToastVariant;
  mensaje: string;
}

export interface ToastContextValue {
  success: (mensaje: string) => void;
  error: (mensaje: string) => void;
  info: (mensaje: string) => void;
}

/**
 * Contexto de avisos, separado del provider y del hook porque Fast
 * Refresh no admite que un mismo fichero exporte componente y función.
 */
export const ToastContext = createContext<ToastContextValue | null>(null);
