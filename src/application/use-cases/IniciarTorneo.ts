import type { Torneo } from '../../domain/entities/Torneo.js';
import type { IInscripcionRepository } from '../../domain/repositories/IInscripcionRepository.js';
import type { ITorneoRepository } from '../../domain/repositories/ITorneoRepository.js';

export class TorneoNoEncontradoError extends Error {}

export class IniciarTorneo {
  constructor(
    private readonly torneoRepository: ITorneoRepository,
    private readonly inscripcionRepository: IInscripcionRepository,
  ) {}

  async ejecutar(torneoId: string): Promise<Torneo> {
    const torneo = await this.torneoRepository.buscarPorId(torneoId);
    if (!torneo) {
      throw new TorneoNoEncontradoError(`torneo ${torneoId} no encontrado`);
    }

    const cantidadConfirmadas = await this.inscripcionRepository.contarConfirmadas(torneoId);
    torneo.iniciar(cantidadConfirmadas); // lanza si no se cumple la invariante

    await this.torneoRepository.guardar(torneo);
    return torneo;
  }
}
