import type { Equipo } from '../../domain/entities/Equipo.js';
import type { IEquipoRepository } from '../../domain/repositories/IEquipoRepository.js';

export class ListarEquiposDeTorneo {
  constructor(private readonly equipoRepository: IEquipoRepository) {}

  async ejecutar(torneoId: string): Promise<Equipo[]> {
    return this.equipoRepository.listarPorTorneoId(torneoId);
  }
}
