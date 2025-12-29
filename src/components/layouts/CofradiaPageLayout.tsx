import React from "react";
import type { ReactNode } from "react";

interface Props {
  activa: ReactNode;
  historico: ReactNode;
  pageSizeActiva?: number;
  pageSizeHistorico?: number;
  totalActiva?: number;
  totalHistorico?: number;
}

export const CofradiaPageLayout: React.FC<Props> = ({ activa, historico }) => (
  <div className="space-y-10">
    {/* Cofradías activas */}
    <section>
      <h1 className="text-xl font-semibold mb-3">Cofradías activas</h1>
      {activa}
    </section>

    {/* Histórico */}
    <section>
      <h2 className="text-lg font-medium mb-3">Histórico de cofradías</h2>
      {historico}
    </section>
  </div>
);
