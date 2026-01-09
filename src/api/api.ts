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

// -------------------- Cofradías --------------------
export const CofradiaEndpoints = {
  list: `/cofradia`, // GET → listado de cofradías de la hermandad activa
  create: `/cofradia`, // POST → crear cofradía (DMG)
  update: (id: number) => `/cofradia/${id}`, // PUT → actualizar cofradía (DMG)
  delete: (id: number) => `/cofradia/${id}`, // DELETE → borrar cofradía (DMG)
  clone: (id: number) => `/cofradia/${id}/clonar`, // POST → clonar cofradía (DMG)
};

// -------------------- Cortejos --------------------
export const CortejoEndpoints = {
  listByCofradia: (cofradiaId: number) => `/cofradias/${cofradiaId}/cortejos`, // GET → listado de cortejos de una cofradía
  create: (cofradiaId: number) => `/cofradias/${cofradiaId}/cortejos`, // POST → crear cortejo (DMG)
  update: (cortejoId: number) => `/cortejos/${cortejoId}`, // PUT → actualizar cortejo (DMG)
  delete: (cortejoId: number) => `/cortejos/${cortejoId}`, // DELETE → borrar cortejo (DMG)
};

// -------------------- Puestos --------------------
export const PuestoEnpoints = {
  list: (cofradiaId: number) => `/cofradias/${cofradiaId}/puestos`,
  create: (cofradiaId: number) => `/cofradias/${cofradiaId}/puestos`,
  update: (cofradiaId: number, puestoId: number) => `/cofradias/${cofradiaId}/puestos/${puestoId}`,
  delete: (cofradiaId: number, puestoId: number) => `/cofradias/${cofradiaId}/puestos/${puestoId}`,
};

// -------------------- Cargos --------------------
export const CargoEndpoints = {
  list: (cofradiaId: number) => `/cofradias/${cofradiaId}/cargos`,
  create: (cofradiaId: number) => `/cofradias/${cofradiaId}/cargos`,
  update: (cofradiaId: number, cargoId: number) => `/cofradias/${cofradiaId}/cargos/${cargoId}`,
  delete: (cofradiaId: number, cargoId: number) => `/cofradias/${cofradiaId}/cargos/${cargoId}`,
};

// -------------------- Tramos --------------------
export const TramoEndpoints = {
  list: (cofradiaId: number, cortejoId: number) =>
    `/cofradias/${cofradiaId}/cortejos/${cortejoId}/tramos`,

  create: (cofradiaId: number, cortejoId: number) =>
    `/cofradias/${cofradiaId}/cortejos/${cortejoId}/tramos`,

  update: (cofradiaId: number, cortejoId: number, tramoId: number) =>
    `/cofradias/${cofradiaId}/cortejos/${cortejoId}/tramos/${tramoId}`,

  delete: (cofradiaId: number, cortejoId: number, tramoId: number) =>
    `/cofradias/${cofradiaId}/cortejos/${cortejoId}/tramos/${tramoId}`,
};

// -------------------- Insignias --------------------
export const InsigniaEndpoints = {
  list: (cofradiaId: number) => `/cofradias/${cofradiaId}/insignias`,
  create: (cofradiaId: number) => `/cofradias/${cofradiaId}/insignias`,
  update: (cofradiaId: number, insigniaId: number) =>
    `/cofradias/${cofradiaId}/insignias/${insigniaId}`,
  delete: (cofradiaId: number, insigniaId: number) =>
    `/cofradias/${cofradiaId}/insignias/${insigniaId}`,
};

// -------------------- Elementos de Insignia --------------------
export const ElementoInsigniaEndpoints = {
  list: (insigniaId: number) => `/cofradias/insignias/${insigniaId}/elementos`,
  create: (insigniaId: number) => `/cofradias/insignias/${insigniaId}/elementos`,
  update: (elementoId: number) => `/cofradias/elementos/${elementoId}`,
  delete: (elementoId: number) => `/cofradias/elementos/${elementoId}`,
};
