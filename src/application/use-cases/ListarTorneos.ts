import type { Torneo } from '../../domain/entities/Torneo.js';
import type { ITorneoRepository } from '../../domain/repositories/ITorneoRepository.js';

interface OpcionesListarTorneos {
  incluirCancelados?: boolean;
}

export class ListarTorneos {
  constructor(private readonly torneoRepository: ITorneoRepository) {}

  async ejecutar(opciones?: OpcionesListarTorneos): Promise<Torneo[]> {
    const torneos = await this.torneoRepository.listar();
    if (opciones?.incluirCancelados) {
      return torneos;
    }
    return torneos.filter((torneo) => torneo.visibleEnListaPublica);
  }
}
