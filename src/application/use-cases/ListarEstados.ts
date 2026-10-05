import type { Estado } from '../../domain/entities/Estado.js';
import type { IEstadoRepository } from '../../domain/repositories/IEstadoRepository.js';

export class ListarEstados {
  constructor(private readonly estadoRepository: IEstadoRepository) {}

  async ejecutar(): Promise<Estado[]> {
    return this.estadoRepository.listar();
  }
}
