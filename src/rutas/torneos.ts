import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AlcanceTorneo, EstadoTorneo, TipoRitmo } from '../domain/enums.js';
import { leerBodyJson, leerCampoBooleano, leerCampoEnum, leerCampoNumero, leerCampoTexto } from '../http/leerBody.js';
import { enviarJson } from '../http/respuestas.js';
import type { Params } from '../http/router.js';

interface Torneo {
  id: string;
  nombre: string;
  alcance: AlcanceTorneo;
  estadoTorneo: EstadoTorneo;
  estadoId: string;
  sistemaCompetenciaId: string;
  ritmoTipo: TipoRitmo;
  ritmoMinutosBase: number;
  ritmoIncrementoSegundos: number;
  otorgaRatingFide: boolean;
  otorgaRatingNacional: boolean;
  fechaInicio: string; // ISO date string; en Prisma es DateTime
  fechaFin: string;
  sede?: string;
  creadoPorId: string;
  createdAt: string;
}

const torneos: Torneo[] = [];

type CamposTorneo = Pick<
  Torneo,
  | 'nombre'
  | 'alcance'
  | 'estadoId'
  | 'sistemaCompetenciaId'
  | 'ritmoTipo'
  | 'ritmoMinutosBase'
  | 'fechaInicio'
  | 'fechaFin'
  | 'creadoPorId'
  | 'sede'
> &
  Partial<Pick<Torneo, 'estadoTorneo' | 'ritmoIncrementoSegundos' | 'otorgaRatingFide' | 'otorgaRatingNacional'>>;

function leerCamposTorneo(body: unknown): CamposTorneo | undefined {
  const nombre = leerCampoTexto(body, 'nombre');
  const alcance = leerCampoEnum(body, 'alcance', Object.values(AlcanceTorneo));
  const estadoId = leerCampoTexto(body, 'estadoId');
  const sistemaCompetenciaId = leerCampoTexto(body, 'sistemaCompetenciaId');
  const ritmoTipo = leerCampoEnum(body, 'ritmoTipo', Object.values(TipoRitmo));
  const ritmoMinutosBase = leerCampoNumero(body, 'ritmoMinutosBase');
  const fechaInicio = leerCampoTexto(body, 'fechaInicio');
  const fechaFin = leerCampoTexto(body, 'fechaFin');
  const creadoPorId = leerCampoTexto(body, 'creadoPorId');

  if (
    !nombre ||
    !alcance ||
    !estadoId ||
    !sistemaCompetenciaId ||
    !ritmoTipo ||
    ritmoMinutosBase === undefined ||
    !fechaInicio ||
    !fechaFin ||
    !creadoPorId
  ) {
    return undefined;
  }

  return {
    nombre,
    alcance,
    estadoId,
    sistemaCompetenciaId,
    ritmoTipo,
    ritmoMinutosBase,
    fechaInicio,
    fechaFin,
    creadoPorId,
    sede: leerCampoTexto(body, 'sede'),
    estadoTorneo: leerCampoEnum(body, 'estadoTorneo', Object.values(EstadoTorneo)),
    ritmoIncrementoSegundos: leerCampoNumero(body, 'ritmoIncrementoSegundos'),
    otorgaRatingFide: leerCampoBooleano(body, 'otorgaRatingFide'),
    otorgaRatingNacional: leerCampoBooleano(body, 'otorgaRatingNacional'),
  };
}

const CAMPOS_REQUERIDOS =
  'nombre, alcance, estadoId, sistemaCompetenciaId, ritmoTipo, ritmoMinutosBase, fechaInicio, fechaFin y creadoPorId son requeridos';

export async function listarTorneos(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  enviarJson(res, 200, torneos);
}

export async function crearTorneo(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const body = await leerBodyJson(req);
  const campos = leerCamposTorneo(body);
  if (!campos) {
    enviarJson(res, 400, { error: CAMPOS_REQUERIDOS });
    return;
  }
  const torneo: Torneo = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    nombre: campos.nombre,
    alcance: campos.alcance,
    estadoId: campos.estadoId,
    sistemaCompetenciaId: campos.sistemaCompetenciaId,
    ritmoTipo: campos.ritmoTipo,
    ritmoMinutosBase: campos.ritmoMinutosBase,
    fechaInicio: campos.fechaInicio,
    fechaFin: campos.fechaFin,
    creadoPorId: campos.creadoPorId,
    sede: campos.sede,
    // Valores con default: si no vinieron en el body, NO se dejan undefined
    // (eso rompería JSON.stringify y, peor, resetearía estos campos en un
    // update futuro que no quería tocarlos).
    estadoTorneo: campos.estadoTorneo ?? EstadoTorneo.Borrador,
    ritmoIncrementoSegundos: campos.ritmoIncrementoSegundos ?? 0,
    otorgaRatingFide: campos.otorgaRatingFide ?? false,
    otorgaRatingNacional: campos.otorgaRatingNacional ?? false,
  };
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
    enviarJson(res, 400, { error: CAMPOS_REQUERIDOS });
    return;
  }

  torneo.nombre = campos.nombre;
  torneo.alcance = campos.alcance;
  torneo.estadoId = campos.estadoId;
  torneo.sistemaCompetenciaId = campos.sistemaCompetenciaId;
  torneo.ritmoTipo = campos.ritmoTipo;
  torneo.ritmoMinutosBase = campos.ritmoMinutosBase;
  torneo.fechaInicio = campos.fechaInicio;
  torneo.fechaFin = campos.fechaFin;
  torneo.creadoPorId = campos.creadoPorId;
  torneo.sede = campos.sede;
  // Estos 4 solo se tocan si vinieron explícitos en el body — si no, el PUT
  // de "solo cambié el nombre" no debe resetear el estado del torneo ni el
  // ritmo a sus defaults.
  if (campos.estadoTorneo !== undefined) torneo.estadoTorneo = campos.estadoTorneo;
  if (campos.ritmoIncrementoSegundos !== undefined) torneo.ritmoIncrementoSegundos = campos.ritmoIncrementoSegundos;
  if (campos.otorgaRatingFide !== undefined) torneo.otorgaRatingFide = campos.otorgaRatingFide;
  if (campos.otorgaRatingNacional !== undefined) torneo.otorgaRatingNacional = campos.otorgaRatingNacional;

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
