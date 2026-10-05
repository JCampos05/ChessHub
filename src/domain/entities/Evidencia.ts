import { randomUUID } from 'node:crypto';
import { TipoEvidencia } from '../enums.js';

interface PropsEvidencia {
  torneoId?: string;
  partidaId?: string;
  tipo: TipoEvidencia;
  url: string;
  subidoPorId: string;
}

export class Evidencia {
  private constructor(
    public readonly id: string,
    public readonly torneoId: string | undefined,
    public readonly partidaId: string | undefined,
    public readonly tipo: TipoEvidencia,
    public readonly url: string,
    public readonly subidoPorId: string,
    public readonly createdAt: Date,
  ) {}

  static crear(props: PropsEvidencia): Evidencia {
    if (!props.torneoId && !props.partidaId) {
      throw new Error('una evidencia debe asociarse a un torneoId o a un partidaId');
    }
    if (!/^https?:\/\//.test(props.url)) {
      throw new Error('url debe ser una URL válida (http/https, se sube a Cloudinary)');
    }
    return new Evidencia(randomUUID(), props.torneoId, props.partidaId, props.tipo, props.url, props.subidoPorId, new Date());
  }
}
