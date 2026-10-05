import { randomUUID } from 'node:crypto';
import { NivelArbitro, RolUsuario } from '../enums.js';

interface PropsUsuarioRol {
  usuarioId: string;
  rol: RolUsuario;
  estadoId?: string;
  torneoId?: string;
  nivelArbitro?: NivelArbitro;
  permisos?: string[];
}

export class UsuarioRol {
  private constructor(
    public readonly id: string,
    public readonly usuarioId: string,
    public readonly rol: RolUsuario,
    public readonly estadoId: string | undefined,
    public readonly torneoId: string | undefined,
    public readonly nivelArbitro: NivelArbitro | undefined,
    public readonly permisos: string[],
    public readonly createdAt: Date,
  ) {}

  static crear(props: PropsUsuarioRol): UsuarioRol {
    UsuarioRol.validarAmbito(props);

    if (props.rol === RolUsuario.Arbitro && !props.nivelArbitro) {
      throw new Error('nivelArbitro es requerido cuando rol = Arbitro');
    }
    if (props.rol !== RolUsuario.Arbitro && props.nivelArbitro) {
      throw new Error('nivelArbitro solo aplica cuando rol = Arbitro');
    }

    return new UsuarioRol(
      randomUUID(),
      props.usuarioId,
      props.rol,
      props.estadoId,
      props.torneoId,
      props.nivelArbitro,
      props.permisos ?? [],
      new Date(),
    );
  }

  private static validarAmbito(props: PropsUsuarioRol): void {
    switch (props.rol) {
      case RolUsuario.AdminFenamac:
        if (props.estadoId || props.torneoId) {
          throw new Error('AdminFenamac no lleva ámbito (nacional total)');
        }
        return;
      case RolUsuario.AdminEstatal:
      case RolUsuario.AdminMunicipal:
        if (!props.estadoId) {
          throw new Error(`${props.rol} requiere estadoId`);
        }
        if (props.torneoId) {
          throw new Error(`${props.rol} no lleva torneoId`);
        }
        return;
      case RolUsuario.AdminTorneo:
      case RolUsuario.Arbitro:
      case RolUsuario.Staff:
        if (!props.torneoId) {
          throw new Error(`${props.rol} requiere torneoId`);
        }
        if (props.estadoId) {
          throw new Error(`${props.rol} no lleva estadoId`);
        }
        return;
    }
  }
}
