import type { Torneo } from '../entities/Torneo.js';

export interface ITorneoRepository {
  guardar(torneo: Torneo): Promise<void>;
  buscarPorId(id: string): Promise<Torneo | undefined>;
  listar(): Promise<Torneo[]>;
}
