import React from "react";
import { ChevronDown, ChevronRight, Users } from "lucide-react";
import type { TramoEnProcesion } from "../../../hooks/useProcesion";

interface ProcesionTramosProps {
  tramos: TramoEnProcesion[];
  /** Tramo abierto al entrar. El primero por defecto. */
  tramoAbierto: number | null;
  onAbrir: (tramoId: number | null) => void;
}

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
}) => (
  <div className="space-y-2">
    {tramos.map((tramo) => {
      const abierto = tramoAbierto === tramo.id;
      const gente = tramo.puestos.reduce((n, p) => n + p.hermanos.length, 0);

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
              {tramo.puestos.length > 0 && (
                <span className="block text-xs text-gray-500 mt-0.5">
                  {tramo.puestos.length} {tramo.puestos.length === 1 ? "puesto" : "puestos"} ·{" "}
                  {gente} {gente === 1 ? "persona" : "personas"}
                </span>
              )}
            </span>

            {abierto ? (
              <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            )}
          </button>

          {abierto && (
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/40">
              {tramo.puestos.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-1">
                  Este tramo todavía no tiene puestos definidos.
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
