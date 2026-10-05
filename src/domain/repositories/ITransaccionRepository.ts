import type { Transaccion } from '../entities/Transaccion.js';

export interface ITransaccionRepository {
  guardar(transaccion: Transaccion): Promise<void>;
  listarPorTorneoId(torneoId: string): Promise<Transaccion[]>;
}
