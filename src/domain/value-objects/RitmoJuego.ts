import { TipoRitmo } from '../enums.js';

export class RitmoJuego {
  private constructor(
    public readonly tipo: TipoRitmo,
    public readonly minutosBase: number,
    public readonly incrementoSegundos: number,
  ) {}

  static crear(tipo: TipoRitmo, minutosBase: number, incrementoSegundos: number): RitmoJuego {
    if (minutosBase <= 0) {
      throw new Error('minutosBase debe ser mayor a 0');
    }
    if (incrementoSegundos < 0) {
      throw new Error('incrementoSegundos no puede ser negativo');
    }
    return new RitmoJuego(tipo, minutosBase, incrementoSegundos);
  }

  equals(otro: RitmoJuego): boolean {
    return this.tipo === otro.tipo && this.minutosBase === otro.minutosBase && this.incrementoSegundos === otro.incrementoSegundos;
  }
}
