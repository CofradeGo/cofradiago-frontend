export const getUserFromStorage = (): {
  role: "DMG" | "AUXILIAR";
  userId: number;
  hermandadId: number;
} | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const parsed = JSON.parse(userStr);

    return {
      role: parsed.role as "DMG" | "AUXILIAR",
      userId: parsed.userId,
      hermandadId: parsed.hermandadId,
    };
  } catch (error) {
    console.error("Error leyendo usuario desde localStorage:", error);
    return null;
  }
};
