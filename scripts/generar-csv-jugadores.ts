import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Genera un CSV de ejemplo para probar el pipeline de streams de la Semana 03.

const NOMBRES = [
  'Juan', 'Maria', 'Carlos', 'Ana', 'Luis', 'Sofia', 'Jose', 'Valentina', 'Miguel', 'Camila',
  'Diego', 'Fernanda', 'Jorge', 'Paola', 'Ricardo', 'Daniela', 'Alberto', 'Ximena', 'Eduardo', 'Andrea',
];
const APELLIDOS = [
  'Campos', 'Ibarra', 'Lopez', 'Garcia', 'Martinez', 'Hernandez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez',
  'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Cruz', 'Morales', 'Reyes', 'Ortiz', 'Guerrero',
];

const TOTAL_FILAS = 150_000;

function elegir<T>(lista: readonly T[]): T {
  return lista[Math.floor(Math.random() * lista.length)] as T;
}

function fechaAleatoria(): string {
  const inicio = new Date(1970, 0, 1).getTime();
  const fin = new Date(2015, 0, 1).getTime();
  const fecha = new Date(inicio + Math.random() * (fin - inicio));
  return fecha.toISOString().slice(0, 10);
}

const lineas: string[] = ['nombre,ape1,ape2,fecha_nacimiento'];
for (let i = 0; i < TOTAL_FILAS; i++) {
  lineas.push(`${elegir(NOMBRES)}${i},${elegir(APELLIDOS)},${elegir(APELLIDOS)},${fechaAleatoria()}`);
}

const destino = fileURLToPath(new URL('../data/jugadores-ejemplo.csv', import.meta.url));
writeFileSync(destino, `${lineas.join('\n')}\n`, 'utf-8');
console.log(`Generadas ${TOTAL_FILAS} filas en ${destino}`);
