import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { BodyInvalidoError } from './http/leerBody.js';
import { conLogging } from './http/logger.js';
import { enviarJson } from './http/respuestas.js';
import { Router } from './http/router.js';
import { actualizarJugador, crearJugador, eliminarJugador, listarJugadores } from './rutas/jugadores.js';
import { streamJugadoresCsv } from './rutas/reportes.js';
import { actualizarTorneo, crearTorneo, eliminarTorneo, listarTorneos } from './rutas/torneos.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';

function handleHealth(_req: IncomingMessage, res: ServerResponse): void {
  enviarJson(res, 200, { status: 'ok', pid: process.pid });
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

function crearRouter(): Router {
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
  router.get('/reportes/jugadores', streamJugadoresCsv);
  return router;
}

export function crearServidor(): Server {
  const router = crearRouter();

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
      // /reportes/jugadores ya pudo haber mandado los headers (204/200) antes
      // de fallar a media transmisión; en ese caso ya no se puede mandar un
      // JSON de error, solo cortar la conexión.
      if (res.headersSent) {
        res.destroy();
        return;
      }
      enviarJson(res, 500, { error: 'Error interno del servidor' });
    }
  }

  return createServer(conLogging(despachar));
}

export function iniciarServidor(): void {
  const server = crearServidor();

  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} escuchando en http://localhost:${PORT} (${NODE_ENV})`);
  });

  function apagar(señal: NodeJS.Signals): void {
    console.log(`Worker ${process.pid} recibió ${señal}, cerrando conexiones...`);
    server.close((error) => {
      if (error) {
        console.error(`Worker ${process.pid} error al cerrar:`, error);
        process.exit(1);
        return;
      }
      console.log(`Worker ${process.pid} cerrado correctamente.`);
      process.exit(0);
    });

    // server.close() espera a que terminen las conexiones en curso; si una se
    // queda colgada, forzamos la salida para no bloquear el shutdown para siempre.
    setTimeout(() => {
      console.error(`Worker ${process.pid} no cerró a tiempo, forzando salida.`);
      process.exit(1);
    }, 10_000).unref();
  }

  process.on('SIGTERM', () => apagar('SIGTERM'));
  process.on('SIGINT', () => apagar('SIGINT'));
}
