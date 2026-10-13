import React, { useState } from "react";
import { PuestosTable } from "./tables/PuestosTable";
import { PuestoForm, type PuestoInput } from "./forms/PuestoForm";
import { ConfirmDialog } from "../atoms/ConfirmDialog";
import { useToast } from "./toast/useToast";
import { usePuestos } from "../../hooks/usePuesto";
import type { Puesto } from "../../types/Puesto";

/** Gestión de puestos: tabla + alta/edición + borrado con confirmación. */
export const GestionPuestos: React.FC<{ cofradiaId: number }> = ({ cofradiaId }) => {
  const toast = useToast();
  const { puestos, loading, error, createPuesto, updatePuesto, deletePuesto } =
    usePuestos(cofradiaId);

  const [formAbierto, setFormAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState<Puesto | null>(null);
  const [porBorrar, setPorBorrar] = useState<Puesto | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const abrirNuevo = () => {
    setEnEdicion(null);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const abrirEdicion = (puesto: Puesto) => {
    setEnEdicion(puesto);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const enviar = async (input: PuestoInput) => {
    setGuardando(true);
    setErrorForm(null);

    try {
      if (enEdicion) {
        await updatePuesto(enEdicion.id, input);
        toast.success(`Puesto "${input.nombre}" actualizado`);
      } else {
        await createPuesto(input);
        toast.success(`Puesto "${input.nombre}" creado`);
      }
      setFormAbierto(false);
      setEnEdicion(null);
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : "No se ha podido guardar el puesto");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    if (!porBorrar) return;

    setBorrando(true);
    try {
      const nombre = porBorrar.nombre;
      await deletePuesto(porBorrar.id);
      toast.success(`Puesto "${nombre}" eliminado`);
      setPorBorrar(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se ha podido eliminar el puesto");
    } finally {
      setBorrando(false);
    }
  };

  return (
    <>
      <PuestosTable
        puestos={puestos}
        loading={loading}
        error={error}
        onAnadir={abrirNuevo}
        onEditar={abrirEdicion}
        onEliminar={setPorBorrar}
      />

      {formAbierto && (
        <PuestoForm
          isOpen={formAbierto}
          key={enEdicion?.id ?? "nuevo"}
          puesto={enEdicion}
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
        titulo="Eliminar puesto"
        mensaje={porBorrar ? `Se eliminará el puesto "${porBorrar.nombre}" de esta cofradía.` : ""}
        loading={borrando}
        onConfirm={confirmarBorrado}
        onCancel={() => setPorBorrar(null)}
      />
    </>
  );
};
