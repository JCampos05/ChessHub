import { randomUUID } from 'node:crypto';

interface PropsMesa {
  rondaId: string;
  numero: number;
  jugadorBlancasId: string;
  jugadorNegrasId?: string; // undefined = bye (jugador libre en la ronda)
  equipoBlancasId?: string;
  equipoNegrasId?: string;
}

export class Mesa {
  private constructor(
    public readonly id: string,
    public readonly rondaId: string,
    public readonly numero: number,
    private _jugadorBlancasId: string,
    private _jugadorNegrasId: string | undefined,
    private _equipoBlancasId: string | undefined,
    private _equipoNegrasId: string | undefined,
  ) {}

  static crear(props: PropsMesa): Mesa {
    Mesa.validarJugadores(props.jugadorBlancasId, props.jugadorNegrasId);
    return new Mesa(randomUUID(), props.rondaId, props.numero, props.jugadorBlancasId, props.jugadorNegrasId, props.equipoBlancasId, props.equipoNegrasId);
  }

  get jugadorBlancasId(): string {
    return this._jugadorBlancasId;
  }

  get jugadorNegrasId(): string | undefined {
    return this._jugadorNegrasId;
  }

  get equipoBlancasId(): string | undefined {
    return this._equipoBlancasId;
  }

  get equipoNegrasId(): string | undefined {
    return this._equipoNegrasId;
  }

  get esBye(): boolean {
    return this._jugadorNegrasId === undefined;
  }

  // Corrección manual puntual de un pareo erróneo.
  reasignarJugadores(jugadorBlancasId: string, jugadorNegrasId: string | undefined): void {
    Mesa.validarJugadores(jugadorBlancasId, jugadorNegrasId);
    this._jugadorBlancasId = jugadorBlancasId;
    this._jugadorNegrasId = jugadorNegrasId;
  }

  private static validarJugadores(jugadorBlancasId: string, jugadorNegrasId: string | undefined): void {
    if (jugadorNegrasId !== undefined && jugadorBlancasId === jugadorNegrasId) {
      throw new Error('jugadorBlancasId y jugadorNegrasId no pueden ser el mismo jugador');
    }
  }
}
