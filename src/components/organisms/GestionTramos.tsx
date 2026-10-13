import React, { useCallback, useState } from "react";
import { TramosTable } from "./tables/TramosTable";
import { TramoForm, type TramoInput } from "./forms/TramoForm";
import { ConfirmDialog } from "../atoms/ConfirmDialog";
import { useToast } from "./toast/useToast";
import { useTramos } from "../../hooks/useTramos";
import { useOrdenable } from "../../hooks/useOrdenable";
import type { Cortejo } from "../../types/Organizacion";
import type { Tramo } from "../../hooks/useTramos";

interface GestionTramosProps {
  cofradiaId: number;
  cortejos: Cortejo[];
  /** Cortejo seleccionado en la página, para saber cuál mostrar. */
  cortejoSeleccionado: number;
  onCambiarCortejo: (cortejoId: number) => void;
}

/**
 * Gestión de los tramos de un cortejo.
 *
 * Los tramos cuelgan de un cortejo, así que la pantalla incluye un
 * selector: antes se mostraban siempre los del primero, sin dejar
 * elegir. Reordenar afecta solo al cortejo abierto.
 */
export const GestionTramos: React.FC<GestionTramosProps> = ({
  cofradiaId,
  cortejos,
  cortejoSeleccionado,
  onCambiarCortejo,
}) => {
  const toast = useToast();
  const { tramos, loading, error, crearTramo, editarTramo, borrarTramo, reordenarTramos, refetch } =
    useTramos(cofradiaId, cortejoSeleccionado);

  const [formAbierto, setFormAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState<Tramo | null>(null);
  const [porBorrar, setPorBorrar] = useState<Tramo | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const guardar = useCallback(
    async (ids: number[]) => {
      await reordenarTramos(ids);
      toast.success("Orden de los tramos guardado");
    },
    [reordenarTramos, toast],
  );

  const {
    items,
    alSoltar,
    guardando: guardandoOrden,
    errorOrden,
  } = useOrdenable({
    items: tramos,
    onGuardarOrden: guardar,
    onError: () => {
      toast.error("No se ha podido guardar el orden. Se ha restaurado la lista.");
      void refetch();
    },
  });

  const cortejoActual = cortejos.find((c) => c.id === cortejoSeleccionado);

  const abrirNuevo = () => {
    setEnEdicion(null);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const abrirEdicion = (tramo: Tramo) => {
    setEnEdicion(tramo);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const enviar = async (input: TramoInput) => {
    setGuardando(true);
    setErrorForm(null);

    try {
      if (enEdicion) {
        await editarTramo(enEdicion.id, input);
        toast.success(`Tramo "${input.nombre}" actualizado`);
      } else {
        await crearTramo(input);
        toast.success(`Tramo "${input.nombre}" creado`);
      }
      setFormAbierto(false);
      setEnEdicion(null);
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : "No se ha podido guardar el tramo");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    if (!porBorrar) return;

    setBorrando(true);
    try {
      const nombre = porBorrar.nombre;
      await borrarTramo(porBorrar.id);
      toast.success(`Tramo "${nombre}" eliminado`);
      setPorBorrar(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se ha podido eliminar el tramo");
    } finally {
      setBorrando(false);
    }
  };

  return (
    <>
      <TramosTable
        tramos={items}
        loading={loading}
        error={error}
        ordenable={{
          alSoltar,
          guardando: guardandoOrden,
          errorOrden,
          getRotulo: (id) => tramos.find((t) => t.id === id)?.nombre ?? `tramo ${id}`,
        }}
        onAnadir={cortejoSeleccionado > 0 ? abrirNuevo : undefined}
        onEditar={abrirEdicion}
        onEliminar={setPorBorrar}
      >
        {cortejos.length > 1 && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="selector-cortejo"
              className="text-sm font-medium text-gray-700 shrink-0"
            >
              Cortejo
            </label>
            <select
              id="selector-cortejo"
              value={cortejoSeleccionado}
              onChange={(e) => onCambiarCortejo(Number(e.target.value))}
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
      </TramosTable>

      {formAbierto && (
        <TramoForm
          isOpen={formAbierto}
          key={enEdicion?.id ?? "nuevo"}
          tramo={enEdicion}
          nombreCortejo={cortejoActual?.nombre}
          loading={guardando}
          errorServidor={errorForm}
          onClose={() => {
            setFormAbierto(false);
            setEnEdicion(null);
          }}
          onSubmit={enviar}
        />
      )}

      <ConfirmDialog
        isOpen={porBorrar !== null}
        titulo="Eliminar tramo"
        mensaje={
          porBorrar
            ? `Se eliminará el tramo "${porBorrar.nombre}" de "${cortejoActual?.nombre ?? "este cortejo"}".`
            : ""
        }
        loading={borrando}
        onConfirm={confirmarBorrado}
        onCancel={() => setPorBorrar(null)}
      />
    </>
  );
};
