import type { Inscripcion } from '../entities/Inscripcion.js';

export interface IInscripcionRepository {
  guardar(inscripcion: Inscripcion): Promise<void>;
  buscarPorId(id: string): Promise<Inscripcion | undefined>;
  // Usado por el caso de uso InscribirJugador para aplicar la invariante
  // "no duplicar mismo jugador+torneo" ANTES de crear la inscripción.
  existeInscripcion(torneoId: string, jugadorId: string): Promise<boolean>;
  // Usado por el caso de uso IniciarTorneo para que Torneo.iniciar() pueda
  // validar su invariante de "al menos 2 inscripciones confirmadas".
  contarConfirmadas(torneoId: string): Promise<number>;
}
