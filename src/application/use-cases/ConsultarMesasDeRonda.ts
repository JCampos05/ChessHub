import type { Mesa } from '../../domain/entities/Mesa.js';
import type { IMesaRepository } from '../../domain/repositories/IMesaRepository.js';

export class ConsultarMesasDeRonda {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async ejecutar(rondaId: string): Promise<Mesa[]> {
    return this.mesaRepository.listarPorRondaId(rondaId);
  }
}
