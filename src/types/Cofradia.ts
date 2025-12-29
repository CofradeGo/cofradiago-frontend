export type EstadoCofradia = "ABIERTA" | "CERRADA";

export interface Cofradia {
  id: number;
  nombre: string;
  anio: number;
  tipo: string;
  estado: EstadoCofradia;
}
