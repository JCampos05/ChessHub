import { randomUUID } from 'node:crypto';
import { EstadoInscripcion } from '../enums.js';

interface PropsInscripcion {
  torneoId: string;
  jugadorId: string;
  categoriaId?: string;
  equipoId?: string;
  montoPagado?: number;
}

export class Inscripcion {
  private constructor(
    public readonly id: string,
    public readonly torneoId: string,
    public readonly jugadorId: string,
    public readonly categoriaId: string | undefined,
    public readonly equipoId: string | undefined,
    private _estado: EstadoInscripcion,
    public readonly montoPagado: number | undefined,
    public readonly fechaInscripcion: Date,
  ) {}

  // "No duplicar mismo jugador+torneo" NO se valida aquí: una instancia de
  // Inscripcion no conoce a sus hermanas. Esa invariante la aplica el caso de
  // uso InscribirJugador consultando IInscripcionRepository.existeInscripcion()
  // ANTES de llamar a este crear().
  static crear(props: PropsInscripcion): Inscripcion {
    if (props.montoPagado !== undefined && props.montoPagado < 0) {
      throw new Error('montoPagado no puede ser negativo');
    }
    return new Inscripcion(
      randomUUID(),
      props.torneoId,
      props.jugadorId,
      props.categoriaId,
      props.equipoId,
      EstadoInscripcion.Pendiente,
      props.montoPagado,
      new Date(),
    );
  }

  get estado(): EstadoInscripcion {
    return this._estado;
  }

  confirmar(): void {
    if (this._estado !== EstadoInscripcion.Pendiente) {
      throw new Error(`no se puede confirmar una inscripción en estado ${this._estado}`);
    }
    this._estado = EstadoInscripcion.Confirmada;
  }

  cancelar(): void {
    if (this._estado === EstadoInscripcion.Cancelada) {
      throw new Error('la inscripción ya está cancelada');
    }
    this._estado = EstadoInscripcion.Cancelada;
  }
}
