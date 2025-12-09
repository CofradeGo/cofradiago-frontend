import React from "react";

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido a CofradeGo</h1>
      <p className="text-lg text-gray-600 text-center max-w-md">
        Accede a tu hermandad mediante <span className="font-mono">/tu-hermandad/login</span> para
        empezar a gestionar tu cofradía.
      </p>
    </div>
  );
};
