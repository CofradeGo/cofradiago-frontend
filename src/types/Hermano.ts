export interface HermanoListado {
  numeroAntiguedad: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  email: string;
}

export interface HermanosListResponse {
  data: HermanoListado[];
  total: number;
  page: number;
  limit: number;
}
