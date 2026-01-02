export interface Puesto {
  id: number;
  cofradiaId: number;
  nombre: string;
  codigo?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface PuestoUI {
  id: number;
  title: string;
  subtitle?: string;
}
