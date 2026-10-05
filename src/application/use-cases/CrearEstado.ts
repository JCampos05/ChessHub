import { Estado } from '../../domain/entities/Estado.js';
import type { IEstadoRepository } from '../../domain/repositories/IEstadoRepository.js';

interface DatosCrearEstado {
  nombre: string;
  clave: string;
  dominio: string;
}

export class EstadoYaExisteError extends Error {}

export class CrearEstado {
  constructor(private readonly estadoRepository: IEstadoRepository) {}

  async ejecutar(datos: DatosCrearEstado): Promise<Estado> {
    const yaExiste = await this.estadoRepository.existePorClave(datos.clave);
    if (yaExiste) {
      throw new EstadoYaExisteError(`ya existe un estado con clave ${datos.clave}`);
    }

    const estado = Estado.crear(datos);
    await this.estadoRepository.guardar(estado);
    return estado;
  }
}
