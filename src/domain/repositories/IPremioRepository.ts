import type { Premio } from '../entities/Premio.js';

// Solo lectura por ahora - AsignarPremio sigue [base] pendiente en
// domain/use-cases.md, guardar() se agrega junto con ese.
export interface IPremioRepository {
  listarPorTorneoId(torneoId: string): Promise<Premio[]>;
}
