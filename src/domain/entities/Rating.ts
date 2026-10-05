import { randomUUID } from 'node:crypto';
import { Rating as RatingVO } from '../value-objects/Rating.js';
import type { TipoRating } from '../enums.js';

interface PropsRating {
  jugadorId: string;
  tipo: TipoRating;
  valor: number;
  certificadoPorId?: string;
}

// Historial de rating por jugador 
export class Rating {
  private constructor(
    public readonly id: string,
    public readonly jugadorId: string,
    public readonly tipo: TipoRating,
    public readonly valor: number,
    public readonly certificadoPorId: string | undefined,
    public readonly fecha: Date,
  ) {}

  static crear(props: PropsRating): Rating {
    RatingVO.crear(props.valor, props.tipo); // valida 0-3500 entero, lanza si no

    return new Rating(randomUUID(), props.jugadorId, props.tipo, props.valor, props.certificadoPorId, new Date());
  }
}
