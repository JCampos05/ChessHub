import { randomUUID } from 'node:crypto';

interface PropsPremio {
  torneoId: string;
  categoriaId?: string;
  jugadorId?: string;
  equipoId?: string;
  posicion: number;
  descripcion: string;
}

export class Premio {
  private constructor(
    public readonly id: string,
    public readonly torneoId: string,
    public readonly categoriaId: string | undefined,
    public readonly jugadorId: string | undefined,
    public readonly equipoId: string | undefined,
    public readonly posicion: number,
    public readonly descripcion: string,
  ) {}

  static crear(props: PropsPremio): Premio {
    if (props.posicion < 1) {
      throw new Error('posicion debe ser >= 1');
    }
    if (!props.jugadorId && !props.equipoId) {
      throw new Error('un premio debe asignarse a un jugadorId o a un equipoId');
    }
    if (props.descripcion.trim() === '') {
      throw new Error('descripcion es requerida');
    }
    return new Premio(randomUUID(), props.torneoId, props.categoriaId, props.jugadorId, props.equipoId, props.posicion, props.descripcion);
  }
}
