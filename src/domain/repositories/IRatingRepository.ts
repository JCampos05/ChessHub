import type { Rating } from '../entities/Rating.js';

// Solo lectura por ahora - CertificarRating sigue [base] pendiente en
// domain/use-cases.md, guardar() se agrega junto con ese.
export interface IRatingRepository {
  listarPorJugadorId(jugadorId: string): Promise<Rating[]>;
}
