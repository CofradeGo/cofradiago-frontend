import React, { useState, useEffect, useRef } from "react";
import { User } from "lucide-react";
import { useLogout } from "../../hooks/useLogout";

interface HeaderProps {
  username: string;
}

export const Header: React.FC<HeaderProps> = ({ username }) => {
  const { logout } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-end items-center p-4 bg-white shadow relative z-10">
      <div className="relative" ref={dropdownRef}>
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
              onClick={() => alert("Ir a perfil (implementa después)")}
            >
              Perfil
            </button>
            <button
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
