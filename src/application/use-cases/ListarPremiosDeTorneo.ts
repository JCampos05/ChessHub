import type { Premio } from '../../domain/entities/Premio.js';
import type { IPremioRepository } from '../../domain/repositories/IPremioRepository.js';

export class ListarPremiosDeTorneo {
  constructor(private readonly premioRepository: IPremioRepository) {}

  async ejecutar(torneoId: string): Promise<Premio[]> {
    return this.premioRepository.listarPorTorneoId(torneoId);
  }
}
