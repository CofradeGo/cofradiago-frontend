import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";

interface HeaderProps {
  username: string;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ username, onToggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    navigate(`/${username}/login`);
  };

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow relative z-40">
      {/* Botón hamburguesa mobile */}
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
        onClick={onToggleSidebar}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Spacer desktop */}
      <div className="hidden md:block" />

      {/* Avatar + nombre usuario */}
      <div className="relative" ref={menuRef}>
        <button
          className="flex items-center gap-2 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-gray-600" />
          </div>
          <span className="text-gray-700 font-medium">{username}</span>
        </button>

        {/* Menú desplegable */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => alert("Ir a perfil")}
            >
              Perfil
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
