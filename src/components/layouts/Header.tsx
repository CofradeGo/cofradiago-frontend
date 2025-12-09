import React, { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../routes/routes";

interface HeaderProps {
  username: string;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, onToggleSidebar }) => {
  const { logout: logoutService } = useLogout();
  const navigate = useNavigate();
  const { domain } = useParams<{ domain: string }>();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutService();
    if (domain) {
      navigate(ROUTES.login(domain), { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const goToPerfil = () => {
    if (domain) {
      navigate(`/${domain}/dashboard/perfil`);
    } else {
      navigate("/dashboard/perfil");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow relative z-10">
      {/* Botón hamburguesa solo móvil */}
      <button onClick={onToggleSidebar} className="md:hidden text-gray-700 focus:outline-none">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Nombre de usuario y dropdown */}
      <div className="relative ml-auto" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <User className="w-8 h-8 rounded-full bg-gray-200 p-1 text-gray-700" />
          <span className="hidden sm:inline font-medium text-gray-700">{username}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-20">
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={goToPerfil}
            >
              Perfil
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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
