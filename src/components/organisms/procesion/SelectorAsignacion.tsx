import React, { useState } from "react";
import { Check, Loader2, Plus, X } from "lucide-react";

interface SelectorAsignacionProps {
  titulo: string;
  /** Lo que ya está guardado en el tramo. */
  guardados: { id: number; nombre: string }[];
  /** Todo lo que hay en la cofradía, para poder añadir más. */
  disponibles: { id: number; nombre: string }[];
  disabled?: boolean;
  guardando?: boolean;
  onGuardar: (ids: number[]) => Promise<void>;
}

/**
 * Asigna insignias o cargos a un tramo.
 *
 * La lista de arriba muestra lo elegido, sea guardado o no: marcar una
 * casilla tiene que verse en algún sitio. Lo que se acaba de marcar y
 * aún no está guardado va en cursiva, y Cancelar lo devuelve.
 *
 * Se guarda de una vez en vez de en cada casilla: pedir confirmación
 * veinte veces seguidas sería una molestia, y el botón solo se habilita
 * si hay cambios de verdad.
 */
export const SelectorAsignacion: React.FC<SelectorAsignacionProps> = ({
  titulo,
  guardados,
  disponibles,
  disabled = false,
  guardando = false,
  onGuardar,
}) => {
  const aIds = (xs: { id: number }[]) => xs.map((x) => x.id);

  const [abierto, setAbierto] = useState(false);

  // Lo elegido arranca con lo guardado y se vuelve a poner si eso cambia
  // desde fuera (otro guardado, un borrado o un guardado en el servidor).
  //
  // Se ajusta durante el render y no en un efecto: con un efecto, React
  // pinta primero las casillas del estado anterior.
  const claveGuardados = aIds(guardados).join(",");
  const [elegidos, setElegidos] = useState(() => aIds(guardados));
  const [claveVista, setClaveVista] = useState(claveGuardados);

  if (claveGuardados !== claveVista) {
    setClaveVista(claveGuardados);
    setElegidos(aIds(guardados));
  }

  const guardadosSet = new Set(aIds(guardados));

  const sinCambios =
    elegidos.length === guardados.length && elegidos.every((id, i) => guardados[i]?.id === id);

  const alternar = (id: number) => {
    setElegidos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // Lo elegido se lista en el mismo orden que lo guardado, y lo nuevo
  // detrás, para que cambiar una insignia no reordene la lista entera.
  const porNombre = new Map(disponibles.map((d) => [d.id, d.nombre]));
  const elegidosOrdenados = [
    ...elegidos.filter((id) => guardadosSet.has(id)),
    ...elegidos.filter((id) => !guardadosSet.has(id)),
  ];

  const porAnadir = disponibles.filter((d) => !elegidos.includes(d.id));

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-2">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h4 className="text-sm font-medium text-gray-900">{titulo}</h4>
        <span className="text-xs text-gray-500">{elegidos.length}</span>
      </div>

      {elegidosOrdenados.length === 0 ? (
        <p className="text-xs text-gray-400 italic">Sin asignar</p>
      ) : (
        <ul className="space-y-0.5 mb-2">
          {elegidosOrdenados.map((id) => {
            const nombre = porNombre.get(id) ?? `#${id}`;
            // Lo marcado pero no guardado se distingue a simple vista.
            const esPendiente = !guardadosSet.has(id);
            return (
              <li key={id} className="flex items-center justify-between gap-2 text-sm">
                <span
                  className={`truncate ${esPendiente ? "text-indigo-700 italic" : "text-gray-700"}`}
                >
                  {nombre}
                  {esPendiente && (
                    <span className="ml-1 text-xs text-indigo-400 not-italic">sin guardar</span>
                  )}
                </span>
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
                          checked={elegidos.includes(d.id)}
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

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={async () => {
                    await onGuardar(elegidos);
                    setAbierto(false);
                  }}
                  disabled={guardando || sinCambios}
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
                    setElegidos(aIds(guardados));
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
