import { NavLink } from "react-router-dom";
import { Users, Bell, Ticket, LayoutList, Shield, IdCard } from "lucide-react";
import CofradeGoLogo from "../../assets/logos/logo-cofradego-black.svg";

interface SidebarProps {
  role: "DMG" | "AUXILIAR";
  hermandadName: string;
  hermandadLogo?: string;
  className?: string; // para controlar visibilidad en mobile
  onClose?: () => void; // cerrar sidebar al hacer click en mobile
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  hermandadName,
  hermandadLogo,
  className,
  onClose,
}) => {
  const DMG_MENU = [
    { label: "Usuarios", to: "/usuarios", icon: <Users className="w-5 h-5" /> },
    { label: "Hermandad", to: "/hermandad", icon: <Shield className="w-5 h-5" /> },
    { label: "Hermanos", to: "/usuarios", icon: <IdCard className="w-5 h-5" /> },
    { label: "Cofradía", to: "/cofradia", icon: <LayoutList className="w-5 h-5" /> },
    { label: "Papeletas de sitio", to: "/papeletas", icon: <Ticket className="w-5 h-5" /> },
    { label: "Notificaciones", to: "/notificaciones", icon: <Bell className="w-5 h-5" /> },
  ];

  const AUX_MENU = [
    { label: "Hermanos", to: "/usuarios", icon: <IdCard className="w-5 h-5" /> },
    { label: "Cofradía", to: "/cofradia", icon: <LayoutList className="w-5 h-5" /> },
    { label: "Papeletas de sitio", to: "/papeletas", icon: <Ticket className="w-5 h-5" /> },
    { label: "Notificaciones", to: "/notificaciones", icon: <Bell className="w-5 h-5" /> },
  ];

  const MENU = role === "DMG" ? DMG_MENU : AUX_MENU;

  return (
    <aside
      className={`h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between ${className}`}
    >
      {/* Cerrar en mobile */}
      {onClose && (
        <div className="flex justify-end p-2 md:hidden">
          <button onClick={onClose} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Logo y nombre */}
      <div className="flex flex-col items-center py-6 gap-3">
        {hermandadLogo && (
          <img
            src={hermandadLogo}
            alt="Logo Hermandad"
            className="w-20 h-20 object-contain rounded-full shadow-md"
          />
        )}
        <h2 className="text-lg font-semibold text-gray-800 text-center px-4">{hermandadName}</h2>
      </div>

      {/* Menu */}
      <nav className="px-4 mt-4 flex-1">
        <ul className="flex flex-col gap-1">
          {MENU.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full px-4 py-2 rounded-xl transition-all
                  text-gray-700 hover:bg-gray-100 hover:text-gray-900
                  ${isActive ? "bg-gray-100 font-semibold" : ""}`
                }
                onClick={onClose}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Branding abajo */}
      <div className="flex flex-col items-center justify-center pb-4 mt-auto text-gray-400">
        <img
          src={CofradeGoLogo}
          alt="CofradeGo Logo"
          className="w-12 h-12 object-contain"
          style={{ filter: "invert(0)" }}
        />
        CofradeGo © {new Date().getFullYear()}
      </div>
    </aside>
  );
};
