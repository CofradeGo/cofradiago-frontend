export const getUserFromStorage = (): {
  role: "DMG" | "AUXILIAR";
  userId: number;
  hermandadId: number;
} | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      console.log("No hay usuario en localStorage, devolviendo null");
      return null;
    }

    const parsed = JSON.parse(userStr);

    const user = {
      role: parsed.role as "DMG" | "AUXILIAR",
      userId: parsed.userId,
      hermandadId: parsed.hermandadId,
    };

    console.log("Usuario leído desde localStorage:", user);
    return user;
  } catch (error) {
    console.error("Error leyendo usuario desde localStorage:", error);
    return null;
  }
};
