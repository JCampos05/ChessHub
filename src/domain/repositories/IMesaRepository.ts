import type { Mesa } from '../entities/Mesa.js';

export interface IMesaRepository {
  guardar(mesa: Mesa): Promise<void>;
  buscarPorId(id: string): Promise<Mesa | undefined>;
  listarPorRondaId(rondaId: string): Promise<Mesa[]>;
}
