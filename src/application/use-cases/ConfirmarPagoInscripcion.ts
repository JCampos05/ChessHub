import { Transaccion } from '../../domain/entities/Transaccion.js';
import { TipoTransaccion } from '../../domain/enums.js';
import type { Inscripcion } from '../../domain/entities/Inscripcion.js';
import type { IInscripcionRepository } from '../../domain/repositories/IInscripcionRepository.js';
import type { ITransaccionRepository } from '../../domain/repositories/ITransaccionRepository.js';

export class InscripcionNoEncontradaError extends Error {}


export class ConfirmarPagoInscripcion {
  constructor(
    private readonly inscripcionRepository: IInscripcionRepository,
    private readonly transaccionRepository: ITransaccionRepository,
  ) {}

  async ejecutar(inscripcionId: string, registradoPorId: string): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.buscarPorId(inscripcionId);
    if (!inscripcion) {
      throw new InscripcionNoEncontradaError(`inscripcion ${inscripcionId} no encontrada`);
    }

    inscripcion.confirmar(); // lanza si no estaba Pendiente
    await this.inscripcionRepository.guardar(inscripcion);

    // Si la inscripción no tiene montoPagado (ej. torneo gratuito), no hay
    // nada que registrar en Finanzas - confirmar no obliga a que haya pago.
    if (inscripcion.montoPagado !== undefined && inscripcion.montoPagado > 0) {
      const transaccion = Transaccion.crear({
        torneoId: inscripcion.torneoId,
        tipo: TipoTransaccion.Ingreso,
        concepto: `Inscripción confirmada - jugador ${inscripcion.jugadorId}`,
        monto: inscripcion.montoPagado,
        registradoPorId,
      });
      await this.transaccionRepository.guardar(transaccion);
    }

    return inscripcion;
  }
}
