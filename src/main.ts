import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { BodyInvalidoError } from './http/leerBody.js';
import { conLogging } from './http/logger.js';
import { enviarJson } from './http/respuestas.js';
import { Router } from './http/router.js';
import { actualizarJugador, crearJugador, eliminarJugador, listarJugadores } from './rutas/jugadores.js';
import { actualizarTorneo, crearTorneo, eliminarTorneo, listarTorneos } from './rutas/torneos.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';

function handleHealth(_req: IncomingMessage, res: ServerResponse): void {
  enviarJson(res, 200, { status: 'ok' });
}

function handleBloqueante(_req: IncomingMessage, res: ServerResponse): void {
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

function handleAsincrono(_req: IncomingMessage, res: ServerResponse): void {
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

const router = new Router();
router.get('/health', handleHealth);
router.get('/demo/bloqueante', handleBloqueante);
router.get('/demo/asincrono', handleAsincrono);
router.get('/torneos', listarTorneos);
router.post('/torneos', crearTorneo);
router.put('/torneos/:id', actualizarTorneo);
router.delete('/torneos/:id', eliminarTorneo);
router.get('/jugadores', listarJugadores);
router.post('/jugadores', crearJugador);
router.put('/jugadores/:id', actualizarJugador);
router.delete('/jugadores/:id', eliminarJugador);

async function despachar(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const encontrada = router.encontrar(req.method ?? 'GET', url.pathname);
    if (!encontrada) {
      enviarJson(res, 404, { error: 'Ruta no encontrada' });
      return;
    }
    await encontrada.handler(req, res, encontrada.params);
  } catch (error) {
    if (error instanceof BodyInvalidoError) {
      enviarJson(res, 400, { error: error.message });
      return;
    }
    console.error('[error]', error);
    enviarJson(res, 500, { error: 'Error interno del servidor' });
  }
}

const server = createServer(conLogging(despachar));

server.listen(PORT, () => {
  console.log(`ChessHub MX backend escuchando en http://localhost:${PORT} (${NODE_ENV})`);
});
