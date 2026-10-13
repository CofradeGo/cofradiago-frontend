import React, { useState } from "react";
import { Check, Loader2, Plus, X } from "lucide-react";

interface SelectorPlazasProps {
  /** Lo que pone en el encabezado: "Insignias", "Cargos" o "Puestos". */
  titulo: string;
  /** Elementos ya guardados en el tramo, con sus plazas. */
  guardados: { id: number; nombre: string; plazas: number }[];
  /** Todos los elementos de la cofradía de esa clase. */
  disponibles: { id: number; nombre: string }[];
  disabled?: boolean;
  guardando?: boolean;
  onGuardar: (elementos: { id: number; plazas: number }[]) => Promise<void>;
}

const MAX_PLAZAS = 999;

/**
 * Asigna insignias, cargos o puestos a un tramo, indicando cuántas
 * personas hacen falta de cada uno.
 *
 * Los tres se editan igual porque significan lo mismo: "en este tramo
 * van estas cosas, y de cada una hacen falta estas personas". Tres
 * diputados son un cargo con `plazas: 3`; cinco personas para llevar la
 * Cruz de Guía son una insignia con `plazas: 5`, aunque la pieza sea
 * una sola.
 *
 * Al montar la estructura se sabe cuántos hacen falta aunque todavía no
 * se sepa quiénes; el módulo de papeleta de sitio rellenará cada plaza.
 */
export const SelectorPlazas: React.FC<SelectorPlazasProps> = ({
  titulo,
  guardados,
  disponibles,
  disabled = false,
  guardando = false,
  onGuardar,
}) => {
  const [abierto, setAbierto] = useState(false);

  const aPlazas = (xs: { id: number; plazas: number }[]) =>
    xs.map((x) => ({ id: x.id, plazas: x.plazas }));

  // Arranca con lo guardado y se vuelve a poner si eso cambia desde
  // fuera. Se ajusta durante el render y no en un efecto: con un
  // efecto, React pinta primero el estado anterior.
  const clave = guardados.map((g) => `${g.id}:${g.plazas}`).join(",");
  const [elegidos, setElegidos] = useState(() => aPlazas(guardados));
  const [claveVista, setClaveVista] = useState(clave);

  if (clave !== claveVista) {
    setClaveVista(clave);
    setElegidos(aPlazas(guardados));
  }

  const guardadosIds = new Set(guardados.map((g) => g.id));

  const hayCambios =
    elegidos.length !== guardados.length ||
    !aPlazas(elegidos).every(
      (e, i) => guardados[i]?.id === e.id && guardados[i]?.plazas === e.plazas,
    );

  const alternar = (id: number) => {
    setElegidos((prev) =>
      prev.some((p) => p.id === id)
        ? prev.filter((p) => p.id !== id)
        : [...prev, { id, plazas: 1 }],
    );
  };

  const cambiarPlazas = (id: number, plazas: number) => {
    setElegidos((prev) => prev.map((p) => (p.id === id ? { ...p, plazas } : p)));
  };

  // Lo guardado primero, en su orden, y lo nuevo detrás: cambiar el
  // número de plazas no reordena la lista.
  const ordenados = [
    ...elegidos.filter((p) => guardadosIds.has(p.id)),
    ...elegidos.filter((p) => !guardadosIds.has(p.id)),
  ];

  const porAnadir = disponibles.filter((d) => !elegidos.some((p) => p.id === d.id));

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h4 className="text-sm font-medium text-gray-900">{titulo}</h4>
        <span className="text-xs text-gray-500">{elegidos.length}</span>
      </div>

      {ordenados.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Sin asignar</p>
      ) : (
        <ul className="space-y-1 mb-2">
          {ordenados.map(({ id, plazas }) => {
            const nombre = disponibles.find((d) => d.id === id)?.nombre ?? `#${id}`;
            const pendiente = !guardadosIds.has(id);
            return (
              <li key={id} className="flex items-center gap-2 text-sm">
                <span
                  className={`flex-1 truncate ${
                    pendiente ? "text-indigo-700 italic" : "text-gray-700"
                  }`}
                >
                  {nombre}
                  {pendiente && (
                    <span className="ml-1 text-xs text-indigo-400 not-italic">sin guardar</span>
                  )}
                </span>

                <label className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-gray-500">plazas</span>
                  <input
                    type="number"
                    min={1}
                    max={MAX_PLAZAS}
                    value={plazas}
                    disabled={disabled || guardando}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      cambiarPlazas(id, Number.isFinite(n) ? n : 1);
                    }}
                    aria-label={`Plazas de ${nombre}`}
                    className="w-14 rounded border border-gray-300 px-1.5 py-0.5 text-xs text-right tabular-nums focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:bg-gray-100"
                  />
                </label>

                {!disabled && (
                  <button
                    onClick={() => alternar(id)}
                    disabled={guardando}
                    title={`Quitar ${nombre}`}
                    aria-label={`Quitar ${nombre}`}
                    className="p-0.5 rounded text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!disabled && (
        <>
          {abierto ? (
            <div className="mt-2 border-t border-gray-100 pt-2">
              {porAnadir.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No queda nada por añadir.</p>
              ) : (
                <ul className="max-h-36 overflow-y-auto space-y-0.5">
                  {porAnadir.map((d) => (
                    <li key={d.id}>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => alternar(d.id)}
                          disabled={guardando}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
                        />
                        <span className="truncate">{d.nombre}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              {elegidos.some((p) => p.plazas < 1 || p.plazas > MAX_PLAZAS) && (
                <p className="mt-2 text-xs text-red-600">
                  Las plazas deben ser un número entre 1 y {MAX_PLAZAS}.
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={async () => {
                    await onGuardar(elegidos);
                    setAbierto(false);
                  }}
                  disabled={guardando || !hayCambios || !plazasValidas(elegidos)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {guardando ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setElegidos(aPlazas(guardados));
                    setAbierto(false);
                  }}
                  disabled={guardando}
                  className="px-2.5 py-1 rounded-md bg-white border border-gray-300 text-gray-600 text-xs hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAbierto(true)}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              {elegidos.length === 0 ? "Asignar" : "Cambiar"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

/** Las plazas tienen que ser enteros dentro del rango. */
const plazasValidas = (elementos: { plazas: number }[]) =>
  elementos.every((e) => Number.isInteger(e.plazas) && e.plazas >= 1 && e.plazas <= MAX_PLAZAS);
