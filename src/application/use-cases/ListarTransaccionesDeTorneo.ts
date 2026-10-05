import type { Transaccion } from '../../domain/entities/Transaccion.js';
import type { ITransaccionRepository } from '../../domain/repositories/ITransaccionRepository.js';

export class ListarTransaccionesDeTorneo {
  constructor(private readonly transaccionRepository: ITransaccionRepository) {}

  async ejecutar(torneoId: string): Promise<Transaccion[]> {
    return this.transaccionRepository.listarPorTorneoId(torneoId);
  }
}
