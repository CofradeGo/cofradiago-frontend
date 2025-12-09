import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { AuthEndpoints } from "../api/api";

export const useLogout = () => {
  const navigate = useNavigate();
  const { domain } = useParams<{ domain: string }>();

  const logout = async () => {
    try {
      await axiosClient.post(AuthEndpoints.logout); // llama al backend
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Limpiar localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Redirigir al login usando el domain de la URL
      if (domain) navigate(`/${domain}/login`, { replace: true });
      else navigate(`/login`, { replace: true });
    }
  };

  return { logout };
};
