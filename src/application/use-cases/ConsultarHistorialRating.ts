import type { Rating } from '../../domain/entities/Rating.js';
import type { IRatingRepository } from '../../domain/repositories/IRatingRepository.js';

export class ConsultarHistorialRating {
  constructor(private readonly ratingRepository: IRatingRepository) {}

  async ejecutar(jugadorId: string): Promise<Rating[]> {
    return this.ratingRepository.listarPorJugadorId(jugadorId);
  }
}
