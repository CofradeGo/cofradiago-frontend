import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", // Ajustar según entorno
  timeout: 5000,
});

// Interceptor de respuesta global
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error);
    return Promise.reject(error);
  },
);

export default axiosClient;
