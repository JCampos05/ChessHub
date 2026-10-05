import { randomUUID } from 'node:crypto';
import { TipoTransaccion } from '../enums.js';

interface PropsTransaccion {
  torneoId: string;
  tipo: TipoTransaccion;
  concepto: string;
  monto: number;
  registradoPorId: string;
}

export class Transaccion {
  private constructor(
    public readonly id: string,
    public readonly torneoId: string,
    public readonly tipo: TipoTransaccion,
    public readonly concepto: string,
    public readonly monto: number,
    public readonly fecha: Date,
    public readonly registradoPorId: string,
  ) {}

  static crear(props: PropsTransaccion): Transaccion {
    if (props.monto <= 0) {
      throw new Error('monto debe ser mayor a 0');
    }
    if (props.concepto.trim() === '') {
      throw new Error('concepto es requerido');
    }
    return new Transaccion(randomUUID(), props.torneoId, props.tipo, props.concepto, props.monto, new Date(), props.registradoPorId);
  }
}
