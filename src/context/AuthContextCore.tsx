import { createContext } from "react";
import type { User } from "./AuthProvider"; // si quieres mantener interfaces separadas
// si quieres mantener interfaces separadas

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, domain: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
