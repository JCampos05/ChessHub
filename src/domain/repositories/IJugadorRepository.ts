import type { Jugador } from '../entities/Jugador.js';

export interface IJugadorRepository {
  guardar(jugador: Jugador): Promise<void>;
  buscarPorId(id: string): Promise<Jugador | undefined>;
  listar(): Promise<Jugador[]>;
}
