import type { Cofradia } from "../../types/Cofradia";
import { StatusBadge } from "../atoms/StatusBadge";

interface Props {
  cofradia: Cofradia;
}

export const CofradiaInfo = ({ cofradia }: Props) => (
  <div className="space-y-2">
    <h2 className="text-xl font-semibold">{cofradia.nombre}</h2>

    <div className="flex gap-4 items-center text-sm text-gray-600">
      <span>Año: {cofradia.anio}</span>
      <span>Tipo: {cofradia.tipo}</span>
      <StatusBadge estado={cofradia.estado} />
    </div>
  </div>
);
