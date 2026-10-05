import { randomUUID } from 'node:crypto';
import { AlcanceTorneo, EstadoTorneo } from '../enums.js';
import { RitmoJuego } from '../value-objects/RitmoJuego.js';

interface PropsTorneo {
  nombre: string;
  alcance: AlcanceTorneo;
  estadoId: string;
  sistemaCompetenciaId: string;
  ritmoJuego: RitmoJuego;
  fechaInicio: Date;
  fechaFin: Date;
  sede?: string;
  creadoPorId: string;
  otorgaRatingFide?: boolean;
  otorgaRatingNacional?: boolean;
}

const MINIMO_INSCRIPCIONES_PARA_INICIAR = 2;

export class Torneo {
  private constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly alcance: AlcanceTorneo,
    private _estadoTorneo: EstadoTorneo,
    public readonly estadoId: string,
    public readonly sistemaCompetenciaId: string,
    public readonly ritmoJuego: RitmoJuego,
    public readonly fechaInicio: Date,
    public readonly fechaFin: Date,
    public readonly sede: string | undefined,
    public readonly creadoPorId: string,
    public readonly otorgaRatingFide: boolean,
    public readonly otorgaRatingNacional: boolean,
    public readonly createdAt: Date,
  ) {}

  static crear(props: PropsTorneo): Torneo {
    if (props.nombre.trim() === '') {
      throw new Error('nombre es requerido');
    }
    // estadoId es obligatorio para TODOS los alcances, incluido Nacional: un
    // torneo nacional siempre se asigna a un estado (regla de negocio del
    // comité, no un detalle técnico — ver domain/entities.md).
    if (props.estadoId.trim() === '') {
      throw new Error('estadoId es requerido, incluso si alcance = Nacional');
    }
    if (props.fechaFin.getTime() < props.fechaInicio.getTime()) {
      throw new Error('fechaFin no puede ser anterior a fechaInicio');
    }

    return new Torneo(
      randomUUID(),
      props.nombre,
      props.alcance,
      EstadoTorneo.Borrador,
      props.estadoId,
      props.sistemaCompetenciaId,
      props.ritmoJuego,
      props.fechaInicio,
      props.fechaFin,
      props.sede,
      props.creadoPorId,
      props.otorgaRatingFide ?? false,
      props.otorgaRatingNacional ?? false,
      new Date(),
    );
  }

  get estadoTorneo(): EstadoTorneo {
    return this._estadoTorneo;
  }

  // Cancelado no desaparece de la base de datos, solo se oculta de listados
  // públicos — el caso de uso que liste torneos para el público debe filtrar
  // con esto, no con una consulta SQL "WHERE estado != CANCELADO" duplicada
  // en cada lugar que consulte torneos.
  get visibleEnListaPublica(): boolean {
    return this._estadoTorneo !== EstadoTorneo.Cancelado;
  }

  // Flujo normal: Borrador -> publicar() -> Publicado -> iniciar() -> EnCurso
  // -> finalizar() -> Terminado. cancelar() es la única salida alterna.
  publicar(): void {
    if (this._estadoTorneo !== EstadoTorneo.Borrador) {
      throw new Error('solo un torneo en Borrador puede publicarse');
    }
    this._estadoTorneo = EstadoTorneo.Publicado;
  }

  // La entidad decide la regla (>=2 inscripciones confirmadas); quien cuenta
  // las inscripciones reales es el caso de uso IniciarTorneo, vía
  // IInscripcionRepository — la entidad nunca toca el repositorio.
  iniciar(cantidadInscripcionesConfirmadas: number): void {
    if (this._estadoTorneo !== EstadoTorneo.Publicado) {
      throw new Error(`no se puede iniciar un torneo en estado ${this._estadoTorneo} (debe estar Publicado)`);
    }
    if (cantidadInscripcionesConfirmadas < MINIMO_INSCRIPCIONES_PARA_INICIAR) {
      throw new Error(`se necesitan al menos ${MINIMO_INSCRIPCIONES_PARA_INICIAR} inscripciones confirmadas para iniciar`);
    }
    this._estadoTorneo = EstadoTorneo.EnCurso;
  }

  finalizar(): void {
    if (this._estadoTorneo !== EstadoTorneo.EnCurso) {
      throw new Error('solo un torneo En Curso puede finalizar');
    }
    this._estadoTorneo = EstadoTorneo.Finalizado;
  }

  // Conservador a propósito: solo se puede cancelar ANTES de que arranque.
  // Cancelar un torneo En Curso es una decisión más delicada (hay resultados,
  // pagos, etc. de por medio) que no está pedida todavía — si se necesita,
  // se amplía esta regla explícitamente, no por omisión.
  cancelar(): void {
    if (this._estadoTorneo !== EstadoTorneo.Borrador && this._estadoTorneo !== EstadoTorneo.Publicado) {
      throw new Error(`no se puede cancelar un torneo en estado ${this._estadoTorneo}`);
    }
    this._estadoTorneo = EstadoTorneo.Cancelado;
  }
}
