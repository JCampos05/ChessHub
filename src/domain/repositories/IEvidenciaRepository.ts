import type { Evidencia } from '../entities/Evidencia.js';

// Solo lectura por ahora - SubirEvidencia sigue [stub] pendiente en
// domain/use-cases.md (depende de IStorageService/Cloudinary), guardar() se
// agrega junto con ese.
export interface IEvidenciaRepository {
  listarPorTorneoId(torneoId: string): Promise<Evidencia[]>;
}
