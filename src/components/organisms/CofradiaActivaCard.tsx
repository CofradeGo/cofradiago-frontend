import type { Cofradia } from "../../types/Cofradia";
import { CofradiaInfo } from "../molecules/CofradiaInfo";
import { CofradiaActions } from "../molecules/CofradiaActions";
import { EmptyState } from "../atoms/EmptyState";

interface Props {
  cofradia: Cofradia | null;
  isDMG: boolean;
}

export const CofradiaActivaCard = ({ cofradia, isDMG }: Props) => {
  if (!cofradia) {
    return <EmptyState message="No hay ninguna cofradía activa actualmente" />;
  }

  return (
    <div className="p-6 border rounded shadow-sm bg-white">
      <CofradiaInfo cofradia={cofradia} />

      <CofradiaActions
        // DMG ve todos los botones
        onGestionar={isDMG ? () => console.log("Gestionar cofradía") : undefined}
        onEditar={isDMG ? () => console.log("Editar cofradía") : undefined}
        // Ver Cortejos lo ven DMG y AUXILIAR
        onVerCortejos={() => console.log("Ver cortejos")}
      />
    </div>
  );
};
