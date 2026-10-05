import type { Evidencia } from '../../domain/entities/Evidencia.js';
import type { IEvidenciaRepository } from '../../domain/repositories/IEvidenciaRepository.js';

export class ListarEvidenciasDeTorneo {
  constructor(private readonly evidenciaRepository: IEvidenciaRepository) {}

  async ejecutar(torneoId: string): Promise<Evidencia[]> {
    return this.evidenciaRepository.listarPorTorneoId(torneoId);
  }
}
