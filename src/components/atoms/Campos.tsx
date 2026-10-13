import React from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const BASE =
  "w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 " +
  "transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500";

interface CampoProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

/**
 * Id estable a partir de la etiqueta. Normaliza acentos y signos:
 * "Código" debe producir `campo-codigo`, no `campo-código`, que es
 * un id con caracteres que rompen selectores y URLs.
 */
const idDesde = (label: string) =>
  `campo-${label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;

const Etiqueta: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {label}
    {required && <span className="text-red-600 ml-0.5">*</span>}
  </label>
);

const pieDeCampo = (error?: string, hint?: string) =>
  error ? (
    <p className="mt-1 text-xs text-red-600">{error}</p>
  ) : hint ? (
    <p className="mt-1 text-xs text-gray-500">{hint}</p>
  ) : null;

/** Campo de texto con etiqueta, error y sugerencia. */
export const CampoTexto: React.FC<CampoProps & InputHTMLAttributes<HTMLInputElement>> = ({
  label,
  error,
  hint,
  required,
  id,
  ...props
}) => {
  const campoId = id ?? idDesde(label);
  return (
    <div className="mb-4">
      <Etiqueta label={label} required={required} />
      <input
        id={campoId}
        aria-invalid={!!error}
        className={`${BASE} ${
          error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-300"
        }`}
        {...props}
      />
      {pieDeCampo(error, hint)}
    </div>
  );
};

export const CampoArea: React.FC<CampoProps & TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  label,
  error,
  hint,
  required,
  id,
  ...props
}) => {
  const campoId = id ?? idDesde(label);
  return (
    <div className="mb-4">
      <Etiqueta label={label} required={required} />
      <textarea
        id={campoId}
        rows={3}
        aria-invalid={!!error}
        className={`${BASE} resize-y ${
          error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-300"
        }`}
        {...props}
      />
      {pieDeCampo(error, hint)}
    </div>
  );
};

interface CampoSelectProps extends CampoProps {
  opciones: { value: string; label: string }[];
  placeholder?: string;
}

export const CampoSelect: React.FC<CampoSelectProps & SelectHTMLAttributes<HTMLSelectElement>> = ({
  label,
  error,
  hint,
  required,
  opciones,
  placeholder,
  id,
  ...props
}) => {
  const campoId = id ?? idDesde(label);
  return (
    <div className="mb-4">
      <Etiqueta label={label} required={required} />
      <select
        id={campoId}
        aria-invalid={!!error}
        className={`${BASE} ${
          error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-indigo-300"
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {opciones.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {pieDeCampo(error, hint)}
    </div>
  );
};

/** Aviso de error general del formulario (validación o fallo del servidor). */
export const ErrorFormulario: React.FC<{ mensaje?: string | null }> = ({ mensaje }) =>
  mensaje ? (
    <div
      role="alert"
      className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {mensaje}
    </div>
  ) : null;
