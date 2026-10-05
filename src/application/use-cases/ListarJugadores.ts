import type { Jugador } from '../../domain/entities/Jugador.js';
import type { IJugadorRepository } from '../../domain/repositories/IJugadorRepository.js';

export class ListarJugadores {
  constructor(private readonly jugadorRepository: IJugadorRepository) {}

  async ejecutar(): Promise<Jugador[]> {
    return this.jugadorRepository.listar();
  }
}
