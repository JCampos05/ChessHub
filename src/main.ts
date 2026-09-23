import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';

function enviarJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function handleHealth(res: ServerResponse): void {
  enviarJson(res, 200, { status: 'ok' });
}

function handleBloqueante(res: ServerResponse): void {
  const inicio = Date.now();
  console.log(`[bloqueante] inicio ${new Date(inicio).toISOString()}`);

  // Bucle síncrono pesado: ocupa el hilo principal por completo, así que
  // el event loop no puede atender ninguna otra petición hasta que termine.
  let acum = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    acum += i;
  }

  const ms = Date.now() - inicio;
  console.log(`[bloqueante] fin (${ms}ms)`);
  enviarJson(res, 200, { tipo: 'bloqueante', ms, acum });
}

function handleAsincrono(res: ServerResponse): void {
  const inicio = Date.now();
  console.log(`[asincrono] inicio ${new Date(inicio).toISOString()}`);

  // setTimeout delega la espera al event loop: el hilo principal queda
  // libre para seguir atendiendo otras peticiones mientras "transcurre" el tiempo.
  setTimeout(() => {
    const ms = Date.now() - inicio;
    console.log(`[asincrono] fin (${ms}ms)`);
    enviarJson(res, 200, { tipo: 'asincrono', ms });
  }, 3000);
}

function router(req: IncomingMessage, res: ServerResponse): void {
  const { method, url } = req;

  if (method === 'GET' && url === '/health') {
    handleHealth(res);
    return;
  }
  if (method === 'GET' && url === '/demo/bloqueante') {
    handleBloqueante(res);
    return;
  }
  if (method === 'GET' && url === '/demo/asincrono') {
    handleAsincrono(res);
    return;
  }

  enviarJson(res, 404, { error: 'No encontrado' });
}

const server = createServer(router);

server.listen(PORT, () => {
  console.log(`ChessHub MX backend escuchando en http://localhost:${PORT} (${NODE_ENV})`);
});
