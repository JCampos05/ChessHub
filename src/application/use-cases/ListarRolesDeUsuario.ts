import type { UsuarioRol } from '../../domain/entities/UsuarioRol.js';
import type { IUsuarioRolRepository } from '../../domain/repositories/IUsuarioRolRepository.js';

export class ListarRolesDeUsuario {
  constructor(private readonly usuarioRolRepository: IUsuarioRolRepository) {}

  async ejecutar(usuarioId: string): Promise<UsuarioRol[]> {
    return this.usuarioRolRepository.listarPorUsuarioId(usuarioId);
  }
}
