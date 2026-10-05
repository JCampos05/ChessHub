import type { Equipo } from '../entities/Equipo.js';

// Solo lectura por ahora - mismo motivo que ICategoriaRepository:
// CrearEquipo/AgregarJugadorAEquipo siguen [base] pendientes en
// domain/use-cases.md, guardar() se agrega junto con esos.
export interface IEquipoRepository {
  listarPorTorneoId(torneoId: string): Promise<Equipo[]>;
}
