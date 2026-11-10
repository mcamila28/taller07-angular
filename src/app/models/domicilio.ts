export type EstadoDomicilio = 'Pendiente' | 'En ruta' | 'Entregado';

export interface Domicilio {
  codigo: string;
  barrio: string;
  producto: string;
  estado: EstadoDomicilio;
}
