import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { leerBodyJson, leerCampoTexto } from '../http/leerBody.js';
import { enviarJson } from '../http/respuestas.js';
import type { Params } from '../http/router.js';

interface Jugador {
  id: string;
  usuarioId?: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string; // ISO date string; en Prisma es DateTime
  estadoId: string;
  club?: string;
  idFederacion?: string;
  activo: boolean;
  createdAt: string;
}

const jugadores: Jugador[] = [];

type CamposJugador = Pick<Jugador, 'usuarioId' | 'nombre' | 'apellidos' | 'fechaNacimiento' | 'estadoId' | 'club' | 'idFederacion'>;

function leerCamposJugador(body: unknown): CamposJugador | undefined {
  const nombre = leerCampoTexto(body, 'nombre');
  const apellidos = leerCampoTexto(body, 'apellidos');
  const fechaNacimiento = leerCampoTexto(body, 'fechaNacimiento');
  const estadoId = leerCampoTexto(body, 'estadoId');
  if (!nombre || !apellidos || !fechaNacimiento || !estadoId) {
    return undefined;
  }
  return {
    nombre,
    apellidos,
    fechaNacimiento,
    estadoId,
    usuarioId: leerCampoTexto(body, 'usuarioId'),
    club: leerCampoTexto(body, 'club'),
    idFederacion: leerCampoTexto(body, 'idFederacion'),
  };
}

export async function listarJugadores(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  enviarJson(res, 200, jugadores);
}

export async function crearJugador(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await leerBodyJson(req);
  const campos = leerCamposJugador(body);
  if (!campos) {
    enviarJson(res, 400, { error: 'nombre, apellidos, fechaNacimiento y estadoId son requeridos' });
    return;
  }
  const jugador: Jugador = {
    id: randomUUID(),
    activo: true,
    createdAt: new Date().toISOString(),
    ...campos,
  };
  jugadores.push(jugador);
  enviarJson(res, 201, jugador);
}

export async function actualizarJugador(req: IncomingMessage, res: ServerResponse, params: Params): Promise<void> {
  const jugador = jugadores.find((j) => j.id === params.id);
  if (!jugador) {
    enviarJson(res, 404, { error: 'Jugador no encontrado' });
    return;
  }
  const body = await leerBodyJson(req);
  const campos = leerCamposJugador(body);
  if (!campos) {
    enviarJson(res, 400, { error: 'nombre, apellidos, fechaNacimiento y estadoId son requeridos' });
    return;
  }
  Object.assign(jugador, campos);
  enviarJson(res, 200, jugador);
}

export async function eliminarJugador(_req: IncomingMessage, res: ServerResponse, params: Params): Promise<void> {
  const indice = jugadores.findIndex((j) => j.id === params.id);
  if (indice === -1) {
    enviarJson(res, 404, { error: 'Jugador no encontrado' });
    return;
  }
  jugadores.splice(indice, 1);
  res.writeHead(204);
  res.end();
}
