import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { leerBodyJson, leerCampoTexto } from '../http/leerBody.js';
import { enviarJson } from '../http/respuestas.js';
import type { Params } from '../http/router.js';

interface Jugador {
  id: string;
  nombre: string;
  ape1: string;
  ape2: string;
  fecha_nacimiento: string;
}

const jugadores: Jugador[] = [];

type CamposJugador = Omit<Jugador, 'id'>;

function leerCamposJugador(body: unknown): CamposJugador | undefined {
  const nombre = leerCampoTexto(body, 'nombre');
  const ape1 = leerCampoTexto(body, 'ape1');
  const ape2 = leerCampoTexto(body, 'ape2');
  const fecha_nacimiento = leerCampoTexto(body, 'fecha_nacimiento');
  if (!nombre || !ape1 || !ape2 || !fecha_nacimiento) {
    return undefined;
  }
  return { nombre, ape1, ape2, fecha_nacimiento };
}

export async function listarJugadores(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  enviarJson(res, 200, jugadores);
}

export async function crearJugador(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await leerBodyJson(req);
  const campos = leerCamposJugador(body);
  if (!campos) {
    enviarJson(res, 400, { error: 'nombre, apellido1, apellido2 y fecha de nacimiento son requeridos' });
    return;
  }
  const jugador: Jugador = { id: randomUUID(), ...campos };
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
    enviarJson(res, 400, { error: 'nombre, apellido1, apellido2 y fecha de nacimiento son requeridos' });
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
