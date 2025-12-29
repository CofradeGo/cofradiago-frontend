import { ActionButton } from "../atoms/ActionButton";

interface Props {
  onGestionar?: () => void;
  onVerCortejos?: () => void;
  onEditar?: () => void;
}

export const CofradiaActions = ({ onGestionar, onVerCortejos, onEditar }: Props) => (
  <div className="flex gap-3 mt-4">
    {onGestionar && <ActionButton label="Gestionar" onClick={onGestionar} />}
    {onVerCortejos && <ActionButton label="Ver cortejos" onClick={onVerCortejos} />}
    {onEditar && <ActionButton label="Editar" onClick={onEditar} />}
  </div>
);
