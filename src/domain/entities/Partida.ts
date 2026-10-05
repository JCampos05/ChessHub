import { randomUUID } from 'node:crypto';
import { ResultadoPartida } from '../enums.js';

export class Partida {
  private constructor(
    public readonly id: string,
    public readonly mesaId: string,
    private _resultado: ResultadoPartida,
    private _pgn: string | undefined,
    private _duracionSegundos: number | undefined,
    private _registradaEn: Date | undefined,
  ) {}

  static crear(props: { mesaId: string }): Partida {
    return new Partida(randomUUID(), props.mesaId, ResultadoPartida.Pendiente, undefined, undefined, undefined);
  }

  get resultado(): ResultadoPartida {
    return this._resultado;
  }

  get pgn(): string | undefined {
    return this._pgn;
  }

  get duracionSegundos(): number | undefined {
    return this._duracionSegundos;
  }

  get registradaEn(): Date | undefined {
    return this._registradaEn;
  }

  // No se puede volver a registrar un resultado ya capturado - evita que un
  // segundo POST accidental (o malicioso) pise el resultado real de la partida.
  registrarResultado(resultado: ResultadoPartida, opciones?: { pgn?: string; duracionSegundos?: number }): void {
    if (this._resultado !== ResultadoPartida.Pendiente) {
      throw new Error('esta partida ya tiene un resultado registrado');
    }
    if (resultado === ResultadoPartida.Pendiente) {
      throw new Error('resultado no puede ser Pendiente');
    }
    this._resultado = resultado;
    this._pgn = opciones?.pgn;
    this._duracionSegundos = opciones?.duracionSegundos;
    this._registradaEn = new Date();
  }
}
