import type { IncomingMessage, ServerResponse } from 'node:http';

export type Params = Record<string, string>;
export type Handler = (req: IncomingMessage, res: ServerResponse, params: Params) => void | Promise<void>;

interface Ruta {
  metodo: string;
  patron: RegExp;
  claves: string[];
  handler: Handler;
}

// Compila un patrón tipo '/torneos/:id' a una regex con grupos de captura,
// recordando en 'claves' el nombre de cada segmento dinámico para poder
// mapear los valores capturados de vuelta a un objeto { id: '...' }.
function compilarPatron(path: string): { patron: RegExp; claves: string[] } {
  const claves: string[] = [];
  const regexStr = path
    .split('/')
    .map((segmento) => {
      if (segmento.startsWith(':')) {
        claves.push(segmento.slice(1));
        return '([^/]+)';
      }
      return segmento.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { patron: new RegExp(`^${regexStr}$`), claves };
}

export class Router {
  private rutas: Ruta[] = [];

  private registrar(metodo: string, path: string, handler: Handler): void {
    const { patron, claves } = compilarPatron(path);
    this.rutas.push({ metodo, patron, claves, handler });
  }

  get(path: string, handler: Handler): void {
    this.registrar('GET', path, handler);
  }

  post(path: string, handler: Handler): void {
    this.registrar('POST', path, handler);
  }

  put(path: string, handler: Handler): void {
    this.registrar('PUT', path, handler);
  }

  delete(path: string, handler: Handler): void {
    this.registrar('DELETE', path, handler);
  }

  encontrar(metodo: string, pathname: string): { handler: Handler; params: Params } | undefined {
    for (const ruta of this.rutas) {
      if (ruta.metodo !== metodo) continue;
      const match = ruta.patron.exec(pathname);
      if (!match) continue;

      const params: Params = {};
      ruta.claves.forEach((clave, indice) => {
        params[clave] = match[indice + 1] ?? '';
      });
      return { handler: ruta.handler, params };
    }
    return undefined;
  }
}
