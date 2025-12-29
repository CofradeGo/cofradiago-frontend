import type { Cofradia } from "../../types/Cofradia";
import { ActionButton } from "../atoms/ActionButton";

interface Props {
  cofradias: Cofradia[];
}

export const CofradiasHistoricoTable = ({ cofradias }: Props) => {
  if (cofradias.length === 0) {
    return <p className="text-gray-500">No hay cofradías cerradas.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Año</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {cofradias.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.anio}</td>
              <td className="p-2">{c.nombre}</td>
              <td className="p-2">
                <ActionButton
                  label="Ver detalle"
                  onClick={() => console.log("Ver detalle", c.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
