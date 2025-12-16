export interface User {
  id: number;
  username: string;
  email: string;
  role: "DMG" | "AUXILIAR";
  hermandadId: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
