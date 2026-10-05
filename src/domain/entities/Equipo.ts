import { randomUUID } from 'node:crypto';

export class Equipo {
  private constructor(
    public readonly id: string,
    public readonly torneoId: string,
    public readonly nombre: string,
    public readonly capitanJugadorId: string | undefined,
  ) {}

  static crear(props: { torneoId: string; nombre: string; capitanJugadorId?: string }): Equipo {
    if (props.nombre.trim() === '') {
      throw new Error('nombre es requerido');
    }
    return new Equipo(randomUUID(), props.torneoId, props.nombre, props.capitanJugadorId);
  }
}
