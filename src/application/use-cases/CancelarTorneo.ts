import type { Torneo } from '../../domain/entities/Torneo.js';
import type { ITorneoRepository } from '../../domain/repositories/ITorneoRepository.js';

export class TorneoNoEncontradoError extends Error {}

export class CancelarTorneo {
  constructor(private readonly torneoRepository: ITorneoRepository) {}

  async ejecutar(torneoId: string): Promise<Torneo> {
    const torneo = await this.torneoRepository.buscarPorId(torneoId);
    if (!torneo) {
      throw new TorneoNoEncontradoError(`torneo ${torneoId} no encontrado`);
    }

    torneo.cancelar(); // lanza si el torneo ya está EnCurso/Finalizado/Cancelado

    await this.torneoRepository.guardar(torneo);
    return torneo;
  }
}
