import React from "react";
import { HermanosTabs } from "../../components/organisms/HermanosTabs";

export const HermanosPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Hermanos</h1>
        <p className="text-gray-600 mt-1">Listado y gestión de los hermanos de la hermandad</p>
      </div>

      {/* Tabs con listado y placeholder de papeleta */}
      <HermanosTabs />
    </div>
  );
};
