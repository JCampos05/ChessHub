import { createReadStream } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { CsvJugadoresATexto } from '../streams/csvJugadoresATexto.js';

const rutaCsvJugadores = fileURLToPath(new URL('../../data/jugadores-ejemplo.csv', import.meta.url));

// Readable (archivo) -> Transform (CSV a NDJSON) -> Writable (la respuesta HTTP),
// conectados con pipeline() para que el backpressure se propague solo entre las
// tres etapas: nunca se carga el CSV completo en memoria.
export async function streamJugadoresCsv(_req: IncomingMessage, res: ServerResponse): Promise<void> {
  res.writeHead(200, { 'Content-Type': 'application/x-ndjson' });
  const origen = createReadStream(rutaCsvJugadores);
  const transformador = new CsvJugadoresATexto();
  await pipeline(origen, transformador, res);
}
