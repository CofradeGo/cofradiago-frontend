import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Users } from "lucide-react";
import { useCofradias } from "../../hooks/useCofradias";
import { useCortejos } from "../../hooks/useCortejos";
import { useProcesion, type TramoEnProcesion } from "../../hooks/useProcesion";
import { useInsignias } from "../../hooks/useInsignias";
import { useCargos } from "../../hooks/useCargo";
import { useTramos } from "../../hooks/useTramos";
import { ConfirmDialog } from "../../components/atoms/ConfirmDialog";
import { ToastProvider } from "../../components/organisms/toast/ToastProvider";
import { useToast } from "../../components/organisms/toast/useToast";
import { getUserFromStorage } from "../../utils/authToken";
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
  const { procesion, loading, error, refetch, guardarInsignias, guardarCargos } = useProcesion(
    id,
    cortejoId ?? 0,
  );

  // Lo que hay en la cofradía para poder asignarlo a los tramos.
  const { insignias } = useInsignias(id);
  const { cargos } = useCargos(id);
  const { crearTramo, borrarTramo } = useTramos(id, cortejoId ?? 0);

  // Editar la estructura es modificar: el AUXILIAR solo consulta.
  const esDMG = getUserFromStorage()?.role === "DMG";

  const [creandoTramo, setCreandoTramo] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorAlta, setErrorAlta] = useState<string | null>(null);
  const [porBorrar, setPorBorrar] = useState<TramoEnProcesion | null>(null);

  // Se ven todos los tramos, tengan o no algo asignado. Filtrar por los
  // que tienen puestos dejaría invisible justo el tramo que se está
  // creando, que aún no tiene ninguno.
  const todosLosTramos = useMemo(() => procesion?.tramos ?? [], [procesion]);

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
    cortejoId === null ? "" : `${cortejoId}:${todosLosTramos.map((t) => t.id).join(",")}`;

  if (claveProcesion !== procesionVista) {
    setProcesionVista(claveProcesion);
    setTramoAbierto(todosLosTramos[0]?.id ?? null);
  }

  const toast = useToast();

  const crear = async () => {
    if (!nombreNuevo.trim() || cortejoId === null) return;
    setGuardando(true);
    setErrorAlta(null);
    try {
      await crearTramo({ nombre: nombreNuevo.trim() });
      // La vista pinta de la procesión, no del listado de tramos: sin
      // esto el tramo nuevo se crearía pero no aparecería.
      await refetch();
      toast.success(`Tramo "${nombreNuevo.trim()}" creado`);
      setNombreNuevo("");
      setCreandoTramo(false);
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "No se ha podido crear el tramo";
      setErrorAlta(mensaje);
      toast.error(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    if (!porBorrar) return;
    setGuardando(true);
    const nombre = porBorrar.nombre;
    try {
      await borrarTramo(porBorrar.id);
      await refetch();
      toast.success(`Tramo "${nombre}" eliminado`);
      setPorBorrar(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se ha podido eliminar el tramo");
    } finally {
      setGuardando(false);
    }
  };

  const guardarInsigniasDelTramo = async (tramoId: number, ids: number[]) => {
    if (cortejoId === null) return;
    setGuardando(true);
    try {
      await guardarInsignias(cortejoId, tramoId, ids);
      toast.success("Insignias del tramo guardadas");
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "No se ha podido guardar";
      toast.error(mensaje);
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  const guardarCargosDelTramo = async (tramoId: number, ids: number[]) => {
    if (cortejoId === null) return;
    setGuardando(true);
    try {
      await guardarCargos(cortejoId, tramoId, ids);
      toast.success("Cargos del tramo guardados");
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : "No se ha podido guardar";
      toast.error(mensaje);
      throw err;
    } finally {
      setGuardando(false);
    }
  };

  const cofradia = cofradiasActivas.find((c: Cofradia) => c.id === id);

  return (
    <ToastProvider>
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
            <label
              htmlFor="cortejo-selector"
              className="text-sm font-medium text-gray-700 shrink-0"
            >
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
        ) : todosLosTramos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center">
            <Users className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="mt-3 text-sm text-gray-600">Este cortejo todavía no tiene tramos.</p>
            <p className="mt-1 text-sm text-gray-500">
              {esDMG
                ? "Empieza por el primero y ve asignando insignias y cargos."
                : "Todavía no hay nada que mostrar."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <span>
                <strong className="text-gray-900">{todosLosTramos.length}</strong>{" "}
                {todosLosTramos.length === 1 ? "tramo" : "tramos"}
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
              tramos={todosLosTramos}
              tramoAbierto={tramoAbierto}
              onAbrir={setTramoAbierto}
              puedeEditar={esDMG}
              insigniasDisponibles={insignias}
              cargosDisponibles={cargos}
              guardando={guardando}
              onGuardarInsignias={guardarInsigniasDelTramo}
              onGuardarCargos={guardarCargosDelTramo}
              onBorrarTramo={setPorBorrar}
            />
          </>
        )}

        {/* Alta de tramo, solo para DMG */}
        {esDMG && (
          <div className="border-t border-gray-200 pt-4">
            {creandoTramo ? (
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label
                    htmlFor="nuevo-tramo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre del tramo
                  </label>
                  <input
                    id="nuevo-tramo"
                    autoFocus
                    value={nombreNuevo}
                    onChange={(e) => {
                      setNombreNuevo(e.target.value);
                      setErrorAlta(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void crear();
                      if (e.key === "Escape") setCreandoTramo(false);
                    }}
                    placeholder="Primer Tramo"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  {errorAlta && <p className="mt-1 text-xs text-red-600">{errorAlta}</p>}
                </div>
                <button
                  onClick={crear}
                  disabled={guardando || !nombreNuevo.trim()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  Crear
                </button>
                <button
                  onClick={() => {
                    setCreandoTramo(false);
                    setErrorAlta(null);
                  }}
                  disabled={guardando}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCreandoTramo(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nuevo tramo
              </button>
            )}
          </div>
        )}

        <ConfirmDialog
          isOpen={porBorrar !== null}
          titulo="Eliminar tramo"
          mensaje={
            porBorrar
              ? `Se eliminará el tramo "${porBorrar.nombre}" y las insignias y cargos que tenga asignados.`
              : ""
          }
          loading={guardando}
          onConfirm={confirmarBorrado}
          onCancel={() => setPorBorrar(null)}
        />
      </div>
    </ToastProvider>
  );
};
