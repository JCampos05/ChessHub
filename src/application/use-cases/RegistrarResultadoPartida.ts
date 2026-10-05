import type { Partida } from '../../domain/entities/Partida.js';
import type { ResultadoPartida } from '../../domain/enums.js';
import type { IPartidaRepository } from '../../domain/repositories/IPartidaRepository.js';

export class PartidaNoEncontradaError extends Error {}

export class RegistrarResultadoPartida {
  constructor(private readonly partidaRepository: IPartidaRepository) {}

  async ejecutar(partidaId: string, resultado: ResultadoPartida, opciones?: { pgn?: string; duracionSegundos?: number }): Promise<Partida> {
    const partida = await this.partidaRepository.buscarPorId(partidaId);
    if (!partida) {
      throw new PartidaNoEncontradaError(`partida ${partidaId} no encontrada`);
    }

    partida.registrarResultado(resultado, opciones); // lanza si ya tenía resultado

    await this.partidaRepository.guardar(partida);
    return partida;
  }
}
