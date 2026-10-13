import React from "react";
import { Award, ChevronDown, ChevronRight, Flag, Trash2, Users } from "lucide-react";
import { SelectorPlazas } from "./SelectorPlazas";
import type { TramoEnProcesion } from "../../../hooks/useProcesion";

interface ProcesionTramosProps {
  tramos: TramoEnProcesion[];
  /** Tramo abierto al entrar. El primero por defecto. */
  tramoAbierto: number | null;
  onAbrir: (tramoId: number | null) => void;
  /** Editar la estructura es tarea de DMG. */
  puedeEditar?: boolean;
  insigniasDisponibles?: { id: number; nombre: string }[];
  cargosDisponibles?: { id: number; nombre: string }[];
  puestosDisponibles?: { id: number; nombre: string }[];
  guardando?: boolean;
  /** Los tres hacen lo mismo: qué elementos van en el tramo y con cuántas plazas. */
  onGuardarInsignias?: (
    tramoId: number,
    elementos: { id: number; plazas: number }[],
  ) => Promise<void>;
  onGuardarCargos?: (tramoId: number, elementos: { id: number; plazas: number }[]) => Promise<void>;
  onGuardarPuestos?: (
    tramoId: number,
    elementos: { id: number; plazas: number }[],
  ) => Promise<void>;
  onBorrarTramo?: (tramo: TramoEnProcesion) => void;
}

/**
 * La línea de debajo del nombre del tramo: qué lleva y para cuánta
 * gente.
 *
 * Las tres clases se resumen igual, así que van por la misma función en
 * vez de tres condiciones repetidas. Los puestos añaden además cuánta
 * gente hay ya, porque es lo único de la vista que son personas reales.
 */
const resumenDe = (tramo: TramoEnProcesion) => {
  const piezas: string[] = [];

  for (const [elementos, singular] of [
    [tramo.insignias, "insignia"],
    [tramo.cargos, "cargo"],
    [tramo.puestos, "puesto"],
  ] as const) {
    if (elementos.length === 0) continue;

    const n = elementos.length;
    const plazas = elementos.reduce((total, e) => total + e.plazas, 0);
    piezas.push(
      `${n} ${n === 1 ? singular : `${singular}s`} · ${plazas} ${plazas === 1 ? "plaza" : "plazas"}`,
    );
  }

  const gente = tramo.puestos.reduce((total, p) => total + p.hermanos.length, 0);
  if (gente > 0) piezas.push(`${gente} ${gente === 1 ? "persona" : "personas"}`);

  return piezas.join(" · ");
};

const HermanosDe = ({
  nombre,
  apellidos,
  numeroAntiguedad,
}: {
  nombre: string;
  apellidos: string;
  numeroAntiguedad: number;
}) => (
  <li className="flex items-baseline gap-2 py-1">
    <span className="inline-flex items-center justify-center min-w-[2.75rem] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-medium tabular-nums">
      {numeroAntiguedad}
    </span>
    <span className="text-sm text-gray-800">
      {nombre} {apellidos}
    </span>
  </li>
);

/**
 * La procesión, tramo a tramo.
 *
 * Va plegada por tramo porque son docenas de personas y desplegarlo
 * todo de golpe es una pared de texto en la que no se encuentra
 * nada. El tramo abierto muestra sus puestos, y dentro de cada uno los
 * hermanos que lo ocupan.
 */
export const ProcesionTramos: React.FC<ProcesionTramosProps> = ({
  tramos,
  tramoAbierto,
  onAbrir,
  puedeEditar = false,
  insigniasDisponibles = [],
  cargosDisponibles = [],
  puestosDisponibles = [],
  guardando = false,
  onGuardarInsignias,
  onGuardarCargos,
  onGuardarPuestos,
  onBorrarTramo,
}) => (
  <div className="space-y-2">
    {tramos.map((tramo) => {
      const abierto = tramoAbierto === tramo.id;

      return (
        <section
          key={tramo.id}
          className={`bg-white rounded-lg border overflow-hidden transition-colors ${
            abierto ? "border-indigo-300 shadow-sm" : "border-gray-200"
          }`}
        >
          <button
            onClick={() => onAbrir(abierto ? null : tramo.id)}
            aria-expanded={abierto}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold shrink-0">
              {tramo.orden}
            </span>

            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-gray-900">{tramo.nombre}</span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {resumenDe(tramo) || "Sin nada asignado todavía"}
              </span>
            </span>

            <span className="flex items-center gap-1 shrink-0">
              {puedeEditar && onBorrarTramo && !abierto && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBorrarTramo(tramo);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      onBorrarTramo(tramo);
                    }
                  }}
                  title="Eliminar tramo"
                  aria-label={`Eliminar ${tramo.nombre}`}
                  className="p-1.5 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </span>
              )}
              {abierto ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </span>
          </button>

          {abierto && (
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/40">
              {puedeEditar ? (
                <div className="grid gap-2 sm:grid-cols-2 mb-3">
                  {onGuardarInsignias && (
                    <SelectorPlazas
                      titulo="Insignias"
                      guardados={tramo.insignias}
                      disponibles={insigniasDisponibles}
                      guardando={guardando}
                      onGuardar={(lista) => onGuardarInsignias(tramo.id, lista)}
                    />
                  )}
                  {onGuardarCargos && (
                    <SelectorPlazas
                      titulo="Cargos"
                      guardados={tramo.cargos}
                      disponibles={cargosDisponibles}
                      guardando={guardando}
                      onGuardar={(lista) => onGuardarCargos(tramo.id, lista)}
                    />
                  )}
                  {onGuardarPuestos && (
                    <SelectorPlazas
                      titulo="Puestos"
                      guardados={tramo.puestos}
                      disponibles={puestosDisponibles}
                      guardando={guardando}
                      onGuardar={(lista) => onGuardarPuestos(tramo.id, lista)}
                    />
                  )}
                </div>
              ) : (
                (tramo.insignias.length > 0 ||
                  tramo.cargos.length > 0 ||
                  tramo.puestos.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tramo.insignias.map((i) => (
                      <span
                        key={i.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs border border-amber-200"
                      >
                        <Flag className="w-3 h-3" />
                        {i.nombre}
                      </span>
                    ))}
                    {tramo.cargos.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 text-xs border border-violet-200"
                      >
                        <Award className="w-3 h-3" />
                        {c.nombre}
                        {c.plazas > 1 && <span className="text-violet-500">×{c.plazas}</span>}
                      </span>
                    ))}
                  </div>
                )
              )}

              {tramo.puestos.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-1">
                  {puedeEditar
                    ? "Este tramo todavía no tiene puestos. Se añaden con el selector de arriba."
                    : "Este tramo todavía no tiene puestos definidos."}
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tramo.puestos.map((puesto) => (
                    <div
                      key={puesto.id}
                      className="bg-white rounded-md border border-gray-200 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900">{puesto.nombre}</h4>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500 shrink-0">
                          <Users className="w-3 h-3" />
                          {puesto.hermanos.length}
                        </span>
                      </div>

                      {puesto.hermanos.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">SinNadie asignado todavía</p>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {puesto.hermanos.map((hermano) => (
                            <HermanosDe
                              key={hermano.id}
                              nombre={hermano.nombre}
                              apellidos={hermano.apellidos}
                              numeroAntiguedad={hermano.numeroAntiguedad}
                            />
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      );
    })}
  </div>
);
