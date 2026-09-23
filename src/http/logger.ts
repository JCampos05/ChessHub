import type { IncomingMessage, ServerResponse } from 'node:http';

type Despachador = (req: IncomingMessage, res: ServerResponse) => void;

// 'finish' se dispara cuando la respuesta ya se envió por completo, así que
// ahí es el único momento en que sabemos el status real y el tiempo total.
export function conLogging(despachar: Despachador): Despachador {
  return (req, res) => {
    const inicio = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - inicio;
      console.log(`${req.method} ${req.url} ${res.statusCode} ${ms}ms`);
    });
    despachar(req, res);
  };
}
