import { randomUUID } from 'node:crypto';

export class Estado {
  private constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly clave: string,
    public readonly dominio: string,
  ) {}

  static crear(props: { nombre: string; clave: string; dominio: string }): Estado {
    if (props.nombre.trim() === '') {
      throw new Error('nombre es requerido');
    }
    if (!/^[A-Z]{2,4}$/.test(props.clave)) {
      throw new Error('clave debe ser un código corto en mayúsculas (ej. "SIN")');
    }
    if (props.dominio.trim() === '') {
      throw new Error('dominio es requerido');
    }
    return new Estado(randomUUID(), props.nombre, props.clave, props.dominio);
  }
}
