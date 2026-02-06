/**
 * Obtiene el dominio actual de forma robusta
 * Prioridad:
 * 1. URL (/dominio-x/...)
 * 2. localStorage
 */
export const getDomain = (): string | null => {
  // 1️⃣ Intentar obtenerlo de la URL
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  // Esperamos algo como: /dominio-hdad/dashboard/...
  if (pathParts.length > 0) {
    return pathParts[0];
  }

  // 2️⃣ Fallback a storage (si lo usas)
  try {
    const stored = localStorage.getItem("domain");
    return stored || null;
  } catch {
    return null;
  }
};
