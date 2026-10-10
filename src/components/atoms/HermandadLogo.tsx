import React, { useState } from "react";

interface HermandadLogoProps {
  /** URL del logo. Si es null/undefined se muestran las iniciales. */
  src?: string | null;
  /** Nombre de la hermandad, usado como alt y para generar las iniciales. */
  name: string;
  className?: string;
}

/** Toma la inicial de las primeras palabras significativas del nombre. */
const iniciales = (nombre: string): string =>
  nombre
    .split(/\s+/)
    .filter((p) => !["de", "del", "la", "el", "los", "las", "y", "en"].includes(p.toLowerCase()))
    .slice(0, 3)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Logo de la hermandad con respaldo local.
 * Si no hay logo o la imagen falla al cargar, muestra las iniciales
 * en lugar de dejar una imagen rota (o depender de un servicio externo).
 */
export const HermandadLogo: React.FC<HermandadLogoProps> = ({
  src,
  name,
  className = "h-32 w-32",
}) => {
  // Guardamos el src que falló, en vez de un booleano resetizable con useEffect.
  // Si el src cambia, la comparación ya no coincide y el logo vuelve a mostrarse.
  const [srcFallido, setSrcFallido] = useState<string | null>(null);
  const fallo = !!src && srcFallido === src;

  // El contenedor define el espacio disponible; la imagen se adapta a él.
  if (!src || fallo) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold select-none`}
        aria-label={`Logo de ${name}`}
      >
        {iniciales(name) || "?"}
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center`}>
      <img
        src={src}
        alt={name}
        onError={() => setSrcFallido(src)}
        className="max-h-full max-w-full object-contain drop-shadow-md"
      />
    </div>
  );
};
