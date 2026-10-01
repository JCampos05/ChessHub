import cluster from 'node:cluster';
import os from 'node:os';
import { iniciarServidor } from './server.js';

const CORES_DISPONIBLES = os.cpus().length;
const NUM_WORKERS = process.env.CLUSTER_WORKERS ? Number(process.env.CLUSTER_WORKERS) : CORES_DISPONIBLES;

if (cluster.isPrimary) {
  console.log(`Primario ${process.pid}: iniciando ${NUM_WORKERS} workers (${CORES_DISPONIBLES} cores disponibles)`);

  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, señal) => {
    console.log(`Worker ${worker.process.pid} terminó (código ${code}, señal ${señal ?? 'ninguna'})`);
  });

  // El primario no escucha peticiones: su único trabajo es repartir SIGTERM/SIGINT
  // a los workers para que cada uno cierre sus propias conexiones en curso.
  const apagarPrimario = (señal: NodeJS.Signals): void => {
    console.log(`Primario ${process.pid} recibió ${señal}, avisando a los workers...`);
    for (const id in cluster.workers) {
      cluster.workers[id]?.process.kill('SIGTERM');
    }
  };
  process.on('SIGTERM', apagarPrimario);
  process.on('SIGINT', apagarPrimario);
} else {
  iniciarServidor();
}
