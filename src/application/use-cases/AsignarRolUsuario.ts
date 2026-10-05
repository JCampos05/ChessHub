import { UsuarioRol } from '../../domain/entities/UsuarioRol.js';
import type { NivelArbitro, RolUsuario } from '../../domain/enums.js';
import type { IUsuarioRolRepository } from '../../domain/repositories/IUsuarioRolRepository.js';

interface DatosAsignarRolUsuario {
  usuarioId: string;
  rol: RolUsuario;
  estadoId?: string;
  torneoId?: string;
  nivelArbitro?: NivelArbitro;
  permisos?: string[];
}

export class RolYaAsignadoError extends Error {}

export class AsignarRolUsuario {
  constructor(private readonly usuarioRolRepository: IUsuarioRolRepository) {}

  async ejecutar(datos: DatosAsignarRolUsuario): Promise<UsuarioRol> {
    const yaAsignado = await this.usuarioRolRepository.existeAsignacion(datos.usuarioId, datos.rol, datos.estadoId, datos.torneoId);
    if (yaAsignado) {
      throw new RolYaAsignadoError(`el usuario ${datos.usuarioId} ya tiene asignado el rol ${datos.rol} con ese mismo ámbito`);
    }

    const usuarioRol = UsuarioRol.crear(datos); // valida ámbito-según-rol 
    await this.usuarioRolRepository.guardar(usuarioRol);
    return usuarioRol;
  }
}
