import type { IncomingMessage } from 'node:http';

export class BodyInvalidoError extends Error {}

// Node no parsea el body: el request es un stream, así que hay
// que acumular los chunks en 'data' y solo intentar JSON.parse cuando el
// stream avisa 'end'.
export function leerBodyJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const partes: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      partes.push(chunk);
    });

    req.on('end', () => {
      if (partes.length === 0) {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(partes).toString('utf-8')));
      } catch {
        reject(new BodyInvalidoError('El body no es JSON válido'));
      }
    });

    req.on('error', reject);
  });
}

export function leerCampoTexto(body: unknown, campo: string): string | undefined {
  if (typeof body !== 'object' || body === null) {
    return undefined;
  }
  const valor = (body as Record<string, unknown>)[campo];
  return typeof valor === 'string' && valor.trim() !== '' ? valor : undefined;
}
