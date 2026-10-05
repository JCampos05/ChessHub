import type { Categoria } from '../entities/Categoria.js';

// Solo lectura por ahora: todavía no existe CrearCategoria en application/
// (sigue [base] pendiente en domain/use-cases.md), así que guardar() se
// agrega cuando ese caso de uso se implemente - no antes, por YAGNI.
export interface ICategoriaRepository {
  listarPorTorneoId(torneoId: string): Promise<Categoria[]>;
}
