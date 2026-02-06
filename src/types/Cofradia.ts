export type EstadoCofradia = "ABIERTA" | "CERRADA";

export interface Cofradia {
  id: number;
  nombre: string;
  anio: number;
  tipo: string;
  estado: EstadoCofradia;
}

// -------------------- Crear Cofradía Full --------------------
export interface CrearCofradiaFullInput {
  // Datos básicos
  nombre: string;
  anio: number;
  tipo: string;

  // Cortejos con tramos e insignias asociadas
  cortejos?: {
    nombre: string;
    orden: number;
    insigniaNames?: string[];
    tramos?: {
      nombre: string;
      orden: number;
    }[];
  }[];

  // Cargos
  cargos?: {
    nombre: string;
  }[];

  // Puestos
  puestos?: {
    nombre: string;
    codigo?: string | null;
  }[];

  // Insignias con elementos
  insignias?: {
    nombre: string;
    descripcion?: string;
    elementos?: {
      tipo: string;
      cantidad: number;
    }[];
  }[];
}
