import { randomUUID } from 'node:crypto';

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Usuario {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    private _activo: boolean,
    public readonly createdAt: Date,
  ) {}

  static crear(props: { email: string; passwordHash: string }): Usuario {
    if (!EMAIL_VALIDO.test(props.email)) {
      throw new Error('email inválido');
    }
    if (props.passwordHash.trim() === '') {
      throw new Error('passwordHash es requerido');
    }
    return new Usuario(randomUUID(), props.email, props.passwordHash, true, new Date());
  }

  get activo(): boolean {
    return this._activo;
  }

  desactivar(): void {
    this._activo = false;
  }
}
