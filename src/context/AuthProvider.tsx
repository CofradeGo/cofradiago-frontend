import React, { useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContextCore";

export interface User {
  username: string;
  role: "DMG" | "AUXILIAR";
  token: string;
}

interface TokenPayload {
  username: string;
  role: "DMG" | "AUXILIAR";
  iat: number;
  exp: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (username: string, password: string, domain: string) => {
    const res = await fetch(`http://localhost:3000/api/v1/auth/login/${domain}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Credenciales incorrectas");

    const data = await res.json();

    const payload: TokenPayload = jwtDecode(data.token);

    const loggedUser: User = {
      username: payload.username,
      role: payload.role,
      token: data.token,
    };

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
