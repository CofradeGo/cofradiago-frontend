export interface Cargo {
  id: number;
  cofradiaId: number;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

export interface CargoUI {
  id: number;
  title: string;
  subtitle?: string;
}
