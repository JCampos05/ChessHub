import { Inscripcion } from '../../domain/entities/Inscripcion.js';
import type { IInscripcionRepository } from '../../domain/repositories/IInscripcionRepository.js';

interface DatosInscribirJugador {
  torneoId: string;
  jugadorId: string;
  categoriaId?: string;
  equipoId?: string;
  montoPagado?: number;
}

export class JugadorYaInscritoError extends Error {}

export class InscribirJugador {
  constructor(private readonly inscripcionRepository: IInscripcionRepository) {}

  async ejecutar(datos: DatosInscribirJugador): Promise<Inscripcion> {
    const yaInscrito = await this.inscripcionRepository.existeInscripcion(datos.torneoId, datos.jugadorId);
    if (yaInscrito) {
      throw new JugadorYaInscritoError(`el jugador ${datos.jugadorId} ya está inscrito en el torneo ${datos.torneoId}`);
    }

    const inscripcion = Inscripcion.crear(datos);
    await this.inscripcionRepository.guardar(inscripcion);
    return inscripcion;
  }
}
