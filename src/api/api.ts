export const API_BASE = import.meta.env.VITE_API_BASE;
// -------------------- Auth --------------------
export const AuthEndpoints = {
  login: (domain: string) => `/auth/login/${domain}`, // relativo, Axios se une con baseURL
  refresh: `/auth/refresh-token`,
  logout: `/auth/logout`,
};

// -------------------- Hermandad --------------------
export const HermandadEndpoints = {
  public: (domain: string) => `/public/hermandad/${domain}`, // público, no requiere API_BASE
  private: (domain: string) => `/hermandad/${domain}`, // privado, Axios usa baseURL + API_BASE
};

// -------------------- Usuarios --------------------
export const UserEndpoints = {
  getAll: `/users`, // GET → devuelve todos los usuarios (DMG) o solo el propio (AUX)
  updateCurrent: `/users`, // PATCH → actualiza usuario logueado
  deleteUser: (id: number) => `/users/${id}`, // DELETE → desactiva usuario
  registerAux: `/users/register`, // POST → crea un nuevo usuario AUX
};

// -------------------- Password / Recuperación --------------------
export const PasswordEndpoints = {
  forgot: `/password/forgot`, // POST → enviar email con token
  reset: `/password/reset`, // POST → cambiar contraseña usando token
};

// -------------------- Hermanos --------------------
export const HermanoEndpoints = {
  list: `/hermanos`, // GET → listado de hermanos de la hermandad activa (por token)
};
