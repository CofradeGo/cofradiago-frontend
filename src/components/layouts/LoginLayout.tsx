import React from "react";

interface LoginLayoutProps {
  cofradeLogo: string;
  hdadLogo: string;
  hdadName: string;
  children?: React.ReactNode;
  onForgotClick?: () => void; // opcional
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({
  cofradeLogo,
  hdadLogo,
  hdadName,
  children,
  onForgotClick,
}) => {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-gray-50">
      {/* BLOQUE LOGIN */}
      <div className="order-1 md:order-2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
          {/* Logo hermandad */}
          <div className="flex flex-col items-center mb-8">
            <img src={hdadLogo} alt={hdadName} className="h-20 w-auto mb-3 drop-shadow-md" />
            <h2 className="text-xl font-semibold text-gray-800 tracking-wide">{hdadName}</h2>
          </div>

          {/* Formulario dinámico */}
          {children}

          {/* Footer */}
          <div className="w-full mt-6 flex items-center justify-between text-sm">
            {onForgotClick && (
              <button
                type="button"
                className="text-indigo-600 hover:underline hover:text-indigo-700 transition"
                onClick={onForgotClick}
              >
                Olvidé mi contraseña
              </button>
            )}
            <span className="text-gray-400">&copy; 2025 CofradeGO</span>
          </div>
        </div>
      </div>

      {/* BLOQUE COFRADEGO */}
      <div className="order-2 md:order-1 flex flex-col items-center justify-center bg-indigo-900 text-white p-10 md:p-16">
        <img src={cofradeLogo} alt="CofradeGO" className="h-32 md:h-48 mb-6 drop-shadow-xl" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-wide text-center">CofradeGO</h1>
        <p className="mt-4 text-indigo-200 text-lg text-center max-w-xs md:max-w-sm">
          La plataforma digital para gestionar tus cofradías
        </p>
      </div>
    </div>
  );
};
