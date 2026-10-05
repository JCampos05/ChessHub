import { randomUUID } from 'node:crypto';

export class Ronda {
  private constructor(
    public readonly id: string,
    public readonly torneoId: string,
    public readonly numero: number,
    public readonly fecha: Date,
    private _publicada: boolean,
    private _cerrada: boolean,
  ) {}

  static crear(props: { torneoId: string; numero: number; fecha: Date }): Ronda {
    if (props.numero < 1) {
      throw new Error('numero de ronda debe ser >= 1');
    }
    return new Ronda(randomUUID(), props.torneoId, props.numero, props.fecha, false, false);
  }

  get publicada(): boolean {
    return this._publicada;
  }

  get cerrada(): boolean {
    return this._cerrada;
  }

  publicar(): void {
    if (this._publicada) {
      throw new Error('la ronda ya está publicada');
    }
    this._publicada = true;
  }

  cerrar(): void {
    if (!this._publicada) {
      throw new Error('no se puede cerrar una ronda que no ha sido publicada');
    }
    this._cerrada = true;
  }
}
