import type { Estado } from '../entities/Estado.js';

export interface IEstadoRepository {
  guardar(estado: Estado): Promise<void>;
  buscarPorId(id: string): Promise<Estado | undefined>;
  listar(): Promise<Estado[]>;
  // Usado por CrearEstado para evitar dos estados con la misma clave (ej. dos "SIN").
  existePorClave(clave: string): Promise<boolean>;
}
