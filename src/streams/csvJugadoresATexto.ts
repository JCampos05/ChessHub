import { Transform, type TransformCallback } from 'node:stream';

const COLUMNAS = ['nombre', 'ape1', 'ape2', 'fecha_nacimiento'] as const;

export class CsvJugadoresATexto extends Transform {
  private restante = '';
  private esEncabezado = true;
  private filasProcesadas = 0;

  override _transform(chunk: Buffer, _encoding: BufferEncoding, callback: TransformCallback): void {
    this.restante += chunk.toString('utf-8');
    const lineas = this.restante.split('\n');
    this.restante = lineas.pop() ?? '';

    for (const linea of lineas) {
      this.procesarLinea(linea);
    }
    callback();
  }

  override _flush(callback: TransformCallback): void {
    if (this.restante.trim() !== '') {
      this.procesarLinea(this.restante);
    }
    callback();
  }

  private procesarLinea(linea: string): void {
    if (this.esEncabezado) {
      this.esEncabezado = false;
      return;
    }

    const valores = linea.split(',');
    if (valores.length !== COLUMNAS.length) {
      return;
    }

    const jugador: Record<string, string> = {};
    COLUMNAS.forEach((columna, indice) => {
      jugador[columna] = valores[indice] ?? '';
    });
    this.push(`${JSON.stringify(jugador)}\n`);
  
    this.filasProcesadas += 1;
    if (this.filasProcesadas % 20_000 === 0) {
      const rssMb = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
      console.log(`[csv->ndjson] ${this.filasProcesadas} filas, RSS ${rssMb}MB`);
    }
  }
}
