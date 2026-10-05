import type { RolUsuario } from '../enums.js';
import type { UsuarioRol } from '../entities/UsuarioRol.js';

export interface IUsuarioRolRepository {
  guardar(usuarioRol: UsuarioRol): Promise<void>;
  existeAsignacion(usuarioId: string, rol: RolUsuario, estadoId: string | undefined, torneoId: string | undefined): Promise<boolean>;
  // Usado por ListarRolesDeUsuario y, eventualmente, por AutenticarUsuario
  // para armar el arreglo roles[] del payload del JWT (ver domain/rbac.md).
  listarPorUsuarioId(usuarioId: string): Promise<UsuarioRol[]>;
}
