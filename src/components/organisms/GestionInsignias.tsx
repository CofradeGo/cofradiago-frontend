import React, { useState } from "react";
import { InsigniasTable } from "./tables/InsigniasTable";
import { InsigniaForm } from "./forms/InsigniaForm";
import { ConfirmDialog } from "../atoms/ConfirmDialog";
import { useToast } from "./toast/useToast";
import { useInsignias } from "../../hooks/useInsignias";
import type { Cortejo, Insignia, InsigniaInput } from "../../types/Organizacion";

/**
 * Gestión de insignias: tabla + alta/edición + borrado con confirmación.
 *
 * Los cortejos se reciben por props porque la pantalla padre ya los
 * carga para los tramos; pedirlos aquí sería una segunda llamada
 * idéntica a la misma URL.
 */
export const GestionInsignias: React.FC<{
  cofradiaId: number;
  cortejos: Cortejo[];
}> = ({ cofradiaId, cortejos }) => {
  const toast = useToast();
  const { insignias, loading, error, crearInsignia, editarInsignia, borrarInsignia } =
    useInsignias(cofradiaId);

  const [formAbierto, setFormAbierto] = useState(false);
  const [enEdicion, setEnEdicion] = useState<Insignia | null>(null);
  const [porBorrar, setPorBorrar] = useState<Insignia | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  const abrirNuevo = () => {
    setEnEdicion(null);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const abrirEdicion = (insignia: Insignia) => {
    setEnEdicion(insignia);
    setErrorForm(null);
    setFormAbierto(true);
  };

  const enviar = async (input: InsigniaInput) => {
    setGuardando(true);
    setErrorForm(null);

    try {
      if (enEdicion) {
        await editarInsignia(enEdicion.id, input);
        toast.success(`Insignia "${input.nombre}" actualizada`);
      } else {
        await crearInsignia(input);
        toast.success(`Insignia "${input.nombre}" creada`);
      }
      setFormAbierto(false);
      setEnEdicion(null);
    } catch (err) {
      setErrorForm(err instanceof Error ? err.message : "No se ha podido guardar la insignia");
    } finally {
      setGuardando(false);
    }
  };

  const confirmarBorrado = async () => {
    if (!porBorrar) return;

    setBorrando(true);
    try {
      const nombre = porBorrar.nombre;
      await borrarInsignia(porBorrar.id);
      toast.success(`Insignia "${nombre}" eliminada`);
      setPorBorrar(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se ha podido eliminar la insignia");
    } finally {
      setBorrando(false);
    }
  };

  return (
    <>
      <InsigniasTable
        insignias={insignias}
        loading={loading}
        error={error}
        onAnadir={abrirNuevo}
        onEditar={abrirEdicion}
        onEliminar={setPorBorrar}
      />

      {formAbierto && (
        <InsigniaForm
          isOpen={formAbierto}
          key={enEdicion?.id ?? "nuevo"}
          insignia={enEdicion}
          cortejos={cortejos}
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
        titulo="Eliminar insignia"
        mensaje={
          porBorrar
            ? `Se eliminará la insignia "${porBorrar.nombre}" y sus elementos asociados.`
            : ""
        }
        loading={borrando}
        onConfirm={confirmarBorrado}
        onCancel={() => setPorBorrar(null)}
      />
    </>
  );
};
