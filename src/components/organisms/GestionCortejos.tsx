import React, { useCallback, useState } from "react";
import { CortejosTable } from "./tables/CortejosTable";
import { CortejoForm } from "./forms/CortejoForm";
import { ConfirmDialog } from "../atoms/ConfirmDialog";
import { useToast } from "./toast/useToast";
import { useCortejos } from "../../hooks/useCortejos";
import { useOrdenable } from "../../hooks/useOrdenable";
import type { Cortejo, CortejoInput } from "../../types/Organizacion";

/**
 * Gestión de cortejos: tabla + alta/edición + borrado con confirmación.
 *
 * Envuelve el hook para que la página no tenga que coordinar seis
 * estados distintos (modal, selección, carga, error) por entidad.
 */
export const GestionCortejos: React.FC<{ cofradiaId: number }> = ({ cofradiaId }) => {
  const toast = useToast();
  const {
    cortejos,
    loading,
    error,
    crearCortejo,
    editarCortejo,
    borrarCortejo,
    reordenarCortejos,
    refetch,
  } = useCortejos(cofradiaId);

  const reordenar = useCallback(
    async (ids: number[]) => {
      await reordenarCortejos(ids);
      toast.success("Orden de los cortejos guardado");
    },
    [reordenarCortejos, toast],
  );

  const {
    items,
    alSoltar,
    guardando: guardandoOrden,
    errorOrden,
  } = useOrdenable({
    items: cortejos,
    onGuardarOrden: reordenar,
    onError: () => {
      toast.error("No se ha podido guardar el orden. Se ha restaurado la lista.");
      void refetch();
    },
  });

  const [formAbierto, setFormAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState<Cortejo | null>(null);
  const [porBorrar, setPorBorrar] = useState<Cortejo | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const abrirNuevo = () => {
    setEnEdicion(null);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const abrirEdicion = (cortejo: Cortejo) => {
    setEnEdicion(cortejo);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const enviar = async (input: CortejoInput) => {
    setGuardando(true);
    setErrorForm(null);

    try {
      if (enEdicion) {
        await editarCortejo(enEdicion.id, input);
        toast.success(`Cortejo "${input.nombre}" actualizado`);
      } else {
        await crearCortejo(input);
        toast.success(`Cortejo "${input.nombre}" creado`);
      }
      setFormAbierto(false);
      setEnEdicion(null);
    } catch (err) {
      // El mensaje real viene del backend (p. ej. nombre duplicado).
      setErrorForm(err instanceof Error ? err.message : "No se ha podido guardar el cortejo");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    if (!porBorrar) return;

    setBorrando(true);
    try {
      const nombre = porBorrar.nombre;
      await borrarCortejo(porBorrar.id);
      toast.success(`Cortejo "${nombre}" eliminado`);
      setPorBorrar(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se ha podido eliminar el cortejo");
    } finally {
      setBorrando(false);
    }
  };

  return (
    <>
      <CortejosTable
        cortejos={items}
        loading={loading}
        error={error}
        ordenable={{
          alSoltar,
          guardando: guardandoOrden,
          errorOrden,
          getRotulo: (id) => cortejos.find((c) => c.id === id)?.nombre ?? `cortejo ${id}`,
        }}
        onAnadir={abrirNuevo}
        onEditar={abrirEdicion}
        onEliminar={setPorBorrar}
      />

      {formAbierto && (
        <CortejoForm
          isOpen={formAbierto}
          key={enEdicion?.id ?? "nuevo"}
          cortejo={enEdicion}
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
        titulo="Eliminar cortejo"
        mensaje={
          porBorrar
            ? `Se eliminará "${porBorrar.nombre}". Los tramos que lo forman y las personas asignadas a ellos se borran con él.`
            : ""
        }
        loading={borrando}
        onConfirm={confirmarBorrado}
        onCancel={() => setPorBorrar(null)}
      />
    </>
  );
};
