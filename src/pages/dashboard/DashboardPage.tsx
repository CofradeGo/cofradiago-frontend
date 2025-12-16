import React from "react";

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800">Bienvenido al Dashboard</h1>

      {/* Aquí puedes añadir secciones de widgets, estadísticas, cards, etc */}
      <section className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-600">Esta es la zona de información básica de la hermandad.</p>
      </section>

      <section className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-600">Secciones vacías para funcionalidades futuras.</p>
      </section>
    </div>
  );
};
