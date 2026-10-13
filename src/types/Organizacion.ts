export interface Cortejo {
  id: number;
  cofradiaId: number;
  nombre: string;
  orden: number;
  createdAt: string;
  updatedAt: string;
}

export interface Insignia {
  id: number;
  cofradiaId: number;
  nombre: string;
  descripcion?: string | null;
  /**
   * Cortejos a los que pertenece la insignia. Es una relación N:M: una
   * insignia puede participar en más de un cortejo, así que el backend
   * devuelve el array, no un único `cortejoId`.
   */
  cortejos: Cortejo[];
  createdAt: string;
  updatedAt: string;
}

/** Insignia con el detalle de sus elementos, que carga useInsignias. */
export interface InsigniaConElementos extends Insignia {
  elementos: InsigniaElemento[];
}

export interface InsigniaElemento {
  id: number;
  insigniaId: number;
  tipo: string;
  cantidad: number;
}

/**
 * Payload de alta. `orden` es opcional: si se omite, el cortejo entra
 * al final y la posición se cambia después arrastrando la fila.
 */
export interface CortejoInput {
  nombre: string;
  orden?: number;
}

export interface CortejoUpdateInput {
  nombre?: string;
  orden?: number;
}

export interface InsigniaInput {
  nombre: string;
  descripcion?: string;
  /** `null` deja la insignia sin asignar a ningún cortejo. */
  cortejoId?: number | null;
}

export interface InsigniaUpdateInput {
  nombre?: string;
  descripcion?: string;
  cortejoId?: number | null;
}
