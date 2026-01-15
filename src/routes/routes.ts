export const ROUTES = {
  login: (domain: string) => `/${domain}/login`,
  dashboard: (domain: string) => `/${domain}/dashboard`,
  perfil: (domain: string) => `/${domain}/perfil`,
  usuarios: (domain: string) => `/${domain}/dashboard/usuarios`,
  hermandad: (domain: string) => `/${domain}/dashboard/hermandad`,
  hermanos: (domain: string) => `/${domain}/dashboard/hermanos`,
  cofradia: (domain: string) => `/${domain}/dashboard/cofradia`,
  papeletas: (domain: string) => `/${domain}/dashboard/papeletas`,
  notificaciones: (domain: string) => `/${domain}/dashboard/notificaciones`,
};
