import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { leerBodyJson, leerCampoTexto } from '../http/leerBody.js';
import { enviarJson } from '../http/respuestas.js';
import type { Params } from '../http/router.js';

interface Torneo {
  id: string;
  nombre: string;
  fecha_torneo: string;
}

const torneos: Torneo[] = [];

type CamposTorneo = Omit<Torneo, 'id'>;

function leerCamposTorneo(body: unknown): CamposTorneo | undefined {
  const nombre = leerCampoTexto(body, 'nombre');
  const fecha_torneo = leerCampoTexto(body, 'fecha_torneo');
  if (!nombre || !fecha_torneo) {
    return undefined;
  }
  return { nombre, fecha_torneo };
}

export async function listarTorneos(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  enviarJson(res, 200, torneos);
}

export async function crearTorneo(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await leerBodyJson(req);
  const campos = leerCamposTorneo(body);
  if (!campos) {
    enviarJson(res, 400, { error: 'nombre y fecha_torneo son requeridos' });
    return;
  }
  const torneo: Torneo = { id: randomUUID(), ...campos };
  torneos.push(torneo);
  enviarJson(res, 201, torneo);
}

export async function actualizarTorneo(req: IncomingMessage, res: ServerResponse, params: Params): Promise<void> {
  const torneo = torneos.find((t) => t.id === params.id);
  if (!torneo) {
    enviarJson(res, 404, { error: 'Torneo no encontrado' });
    return;
  }
  const body = await leerBodyJson(req);
  const campos = leerCamposTorneo(body);
  if (!campos) {
    enviarJson(res, 400, { error: 'nombre y fecha_torneo son requeridos' });
    return;
  }
  Object.assign(torneo, campos);
  enviarJson(res, 200, torneo);
}

export async function eliminarTorneo(_req: IncomingMessage, res: ServerResponse, params: Params): Promise<void> {
  const indice = torneos.findIndex((t) => t.id === params.id);
  if (indice === -1) {
    enviarJson(res, 404, { error: 'Torneo no encontrado' });
    return;
  }
  torneos.splice(indice, 1);
  res.writeHead(204);
  res.end();
}
