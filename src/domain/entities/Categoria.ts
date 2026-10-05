import { randomUUID } from 'node:crypto';

interface PropsCategoria {
  torneoId: string;
  nombre: string;
  edadMin?: number;
  edadMax?: number;
  ratingMin?: number;
  ratingMax?: number;
}

export class Categoria {
  private constructor(
    public readonly id: string,
    public readonly torneoId: string,
    public readonly nombre: string,
    public readonly edadMin: number | undefined,
    public readonly edadMax: number | undefined,
    public readonly ratingMin: number | undefined,
    public readonly ratingMax: number | undefined,
  ) {}

  static crear(props: PropsCategoria): Categoria {
    if (props.nombre.trim() === '') {
      throw new Error('nombre es requerido');
    }
    if (props.edadMin !== undefined && props.edadMax !== undefined && props.edadMin > props.edadMax) {
      throw new Error('edadMin no puede ser mayor a edadMax');
    }
    if (props.ratingMin !== undefined && props.ratingMax !== undefined && props.ratingMin > props.ratingMax) {
      throw new Error('ratingMin no puede ser mayor a ratingMax');
    }
    return new Categoria(randomUUID(), props.torneoId, props.nombre, props.edadMin, props.edadMax, props.ratingMin, props.ratingMax);
  }
}
