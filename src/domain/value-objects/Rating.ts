import { TipoRating } from '../enums.js';

export class Rating {
  private constructor(
    public readonly valor: number,
    public readonly tipo: TipoRating,
  ) {}

  static crear(valor: number, tipo: TipoRating): Rating {
    if (!Number.isInteger(valor) || valor < 0 || valor > 3500) {
      throw new Error('valor de rating debe ser un entero entre 0 y 3500');
    }
    return new Rating(valor, tipo);
  }

  equals(otro: Rating): boolean {
    return this.valor === otro.valor && this.tipo === otro.tipo;
  }
}
