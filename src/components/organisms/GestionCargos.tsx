import React, { useState } from "react";
import { CargosTable } from "./tables/CargosTable";
import { CargoForm } from "./forms/CargoForm";
import { ConfirmDialog } from "../atoms/ConfirmDialog";
import { useToast } from "./toast/useToast";
import { useCargos } from "../../hooks/useCargo";
import type { Cargo } from "../../types/Cargo";

/** Gestión de cargos: tabla + alta/edición + borrado con confirmación. */
export const GestionCargos: React.FC<{ cofradiaId: number }> = ({ cofradiaId }) => {
  const toast = useToast();
  const { cargos, loading, error, crearCargo, editarCargo, borrarCargo } = useCargos(cofradiaId);

  const [formAbierto, setFormAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState<Cargo | null>(null);
  const [porBorrar, setPorBorrar] = useState<Cargo | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const abrirNuevo = () => {
    setEnEdicion(null);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const abrirEdicion = (cargo: Cargo) => {
    setEnEdicion(cargo);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const enviar = async (nombre: string) => {
    setGuardando(true);
    setErrorForm(null);

    try {
      if (enEdicion) {
        await editarCargo(enEdicion.id, nombre);
        toast.success(`Cargo "${nombre}" actualizado`);
      } else {
        await crearCargo(nombre);
        toast.success(`Cargo "${nombre}" creado`);
      }
      setFormAbierto(false);
      setEnEdicion(null);
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : "No se ha podido guardar el cargo");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    if (!porBorrar) return;

    setBorrando(true);
    try {
      const nombre = porBorrar.nombre;
      await borrarCargo(porBorrar.id);
      toast.success(`Cargo "${nombre}" eliminado`);
      setPorBorrar(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se ha podido eliminar el cargo");
    } finally {
      setBorrando(false);
    }
  };

  return (
    <>
      <CargosTable
        cargos={cargos}
        loading={loading}
        error={error}
        onAnadir={abrirNuevo}
        onEditar={abrirEdicion}
        onEliminar={setPorBorrar}
      />

      {formAbierto && (
        <CargoForm
          isOpen={formAbierto}
          key={enEdicion?.id ?? "nuevo"}
          cargo={enEdicion}
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
        titulo="Eliminar cargo"
        mensaje={porBorrar ? `Se eliminará el cargo "${porBorrar.nombre}" de esta cofradía.` : ""}
        loading={borrando}
        onConfirm={confirmarBorrado}
        onCancel={() => setPorBorrar(null)}
      />
    </>
  );
};
