import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { useCofradias } from "../../hooks/useCofradias";
import { useCortejos } from "../../hooks/useCortejos";
import { useProcesion } from "../../hooks/useProcesion";
import type { Cofradia } from "../../types/Cofradia";
import { ProcesionTramos } from "../../components/organisms/procesion/ProcesionTramos";

/**
 * "Ver Cortejos": la procesión de una cofradía, tramo a tramo.
 *
 * Es la vista de consulta, no de gestión. Cada hermandad puede tener
 * varios cortejos y cada cortejo su propia organización, así que el
 * cortejo se elige aquí y no se da por supuesto: hoy el ejemplo tiene
 * uno, pero mañana la hermandad puede montar tres con distintos
 * tramos.
 */
export const CortejosPage: React.FC = () => {
  const { cofradiaId } = useParams();
  const navigate = useNavigate();

  const id = Number(cofradiaId) || 0;
  const { cofradiasActivas } = useCofradias();
  const { cortejos, loading: loadingCortejos } = useCortejos(id);

  const [cortejoElegido, setCortejoElegido] = useState<number | null>(null);
  // Sin elección explícita se enseña el primer cortejo, que es el que
  // va en cabeza. Se deriva en vez de guardarse en estado para que no
  // haga falta un efecto que lo rellene cuando lleguen los datos.
  const cortejoId = cortejoElegido ?? cortejos[0]?.id ?? null;
  const { procesion, loading, error } = useProcesion(id, cortejoId ?? 0);

  // Solo los tramos que tienen algo que enseñar: un cortejo recién
  // creado puede tener tramos vacíos colgando.
  const tramosConPuestos = useMemo(
    () => procesion?.tramos.filter((t) => t.puestos.length > 0) ?? [],
    [procesion],
  );

  const [tramoAbierto, setTramoAbierto] = useState<number | null>(null);
  const [procesionVista, setProcesionVista] = useState("");

  // Se abre el primer tramo de la procesión que se está viendo. La
  // clave lleva el cortejo y sus tramos porque los tramos llegan
  // después que la lista de cortejos: mirar solo el cambio de cortejo
  // no basta, el primer render aún no tiene nada que abrir.
  //
  // Se ajusta durante el render y no en un efecto: con un efecto,
  // React pinta primero el tramo que estaba abierto antes.
  const claveProcesion =
    cortejoId === null ? "" : `${cortejoId}:${tramosConPuestos.map((t) => t.id).join(",")}`;

  if (claveProcesion !== procesionVista) {
    setProcesionVista(claveProcesion);
    setTramoAbierto(tramosConPuestos[0]?.id ?? null);
  }

  const cofradia = cofradiasActivas.find((c: Cofradia) => c.id === id);

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a cofradías
      </button>

      <header>
        <h1 className="text-2xl font-bold text-gray-900">Cortejos</h1>
        <p className="text-sm text-gray-500 mt-1">
          {cofradia
            ? `${cofradia.nombre} · organización de la procesión`
            : "Organización de la procesión"}
        </p>
      </header>

      {/* Selector de cortejo */}
      {cortejos.length > 1 && (
        <div className="flex items-center gap-2">
          <label htmlFor="cortejo-selector" className="text-sm font-medium text-gray-700 shrink-0">
            Cortejo
          </label>
          <select
            id="cortejo-selector"
            value={cortejoId ?? ""}
            onChange={(e) => setCortejoElegido(Number(e.target.value))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {cortejos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {loadingCortejos || loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Cargando procesión...</span>
        </div>
      ) : error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : tramosConPuestos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <Users className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="mt-3 text-sm text-gray-600">
            Este cortejo todavía no tiene tramos con puestos.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            <span>
              <strong className="text-gray-900">{tramosConPuestos.length}</strong>{" "}
              {tramosConPuestos.length === 1 ? "tramo" : "tramos"}
            </span>
            <span>
              <strong className="text-gray-900">{procesion?.totales.puestos}</strong>{" "}
              {procesion?.totales.puestos === 1 ? "puesto" : "puestos"}
            </span>
            <span>
              <strong className="text-gray-900">{procesion?.totales.hermanos}</strong>{" "}
              {procesion?.totales.hermanos === 1 ? "persona" : "personas"}
            </span>
          </div>

          <ProcesionTramos
            tramos={tramosConPuestos}
            tramoAbierto={tramoAbierto}
            onAbrir={setTramoAbierto}
          />
        </>
      )}
    </div>
  );
};
