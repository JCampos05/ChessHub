import { randomUUID } from 'node:crypto';

interface PropsJugador {
  usuarioId?: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: Date;
  estadoId: string;
  club?: string;
  idFederacion?: string;
}

export class Jugador {
  private constructor(
    public readonly id: string,
    public readonly usuarioId: string | undefined,
    public readonly nombre: string,
    public readonly apellidos: string,
    public readonly fechaNacimiento: Date,
    public readonly estadoId: string,
    public readonly club: string | undefined,
    public readonly idFederacion: string | undefined,
    private _activo: boolean,
    public readonly createdAt: Date,
  ) {}

  static crear(props: PropsJugador): Jugador {
    if (props.nombre.trim() === '') {
      throw new Error('nombre es requerido');
    }
    if (props.apellidos.trim() === '') {
      throw new Error('apellidos es requerido');
    }
    if (props.fechaNacimiento.getTime() > Date.now()) {
      throw new Error('fechaNacimiento no puede ser en el futuro');
    }
    if (props.estadoId.trim() === '') {
      throw new Error('estadoId es requerido');
    }
    return new Jugador(
      randomUUID(),
      props.usuarioId,
      props.nombre,
      props.apellidos,
      props.fechaNacimiento,
      props.estadoId,
      props.club,
      props.idFederacion,
      true,
      new Date(),
    );
  }

  get activo(): boolean {
    return this._activo;
  }

  desactivar(): void {
    this._activo = false;
  }
}
