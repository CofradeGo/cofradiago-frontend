import React from "react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message = "No hay datos disponibles" }) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17v-6h6v6h4v2H5v-2h4z"
      />
    </svg>
    <p>{message}</p>
  </div>
);

export default EmptyState;
