import React from "react";
import { FileText } from "lucide-react";

export const PapeletaSitioPlaceholder: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow border border-dashed border-gray-300">
      <FileText className="w-12 h-12 text-gray-400 mb-4" />
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Papeleta de sitio</h2>
      <p className="text-gray-500 text-center px-4">
        Aquí se mostrará el formulario para crear y gestionar las papeletas de sitio. Por ahora esta
        sección está en construcción.
      </p>
    </div>
  );
};
