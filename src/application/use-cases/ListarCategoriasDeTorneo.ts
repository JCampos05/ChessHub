import type { Categoria } from '../../domain/entities/Categoria.js';
import type { ICategoriaRepository } from '../../domain/repositories/ICategoriaRepository.js';

export class ListarCategoriasDeTorneo {
  constructor(private readonly categoriaRepository: ICategoriaRepository) {}

  async ejecutar(torneoId: string): Promise<Categoria[]> {
    return this.categoriaRepository.listarPorTorneoId(torneoId);
  }
}
