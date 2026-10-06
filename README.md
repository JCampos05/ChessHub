# ChessHub MX - Backend

Sistema de gestión integral de eventos y torneos de ajedrez (organización estatal/municipal,
con soporte para torneos nacionales asignados a un estado).

## Estado actual

Semana 03 (`v1.2.0-streams-buffers-cluster`): streaming de archivos grandes con `pipeline()`,
cluster con N workers (`os.cpus().length` por defecto), graceful shutdown y prueba de carga con
autocannon. Sin base de datos ni dominio de ajedrez todavía.

## Uso

```bash
npm install
npm run generar:csv   # genera data/jugadores-ejemplo.csv (150k filas), solo hace falta una vez
npm run dev            # levanta el cluster; CLUSTER_WORKERS=N para forzar el número de workers
npm run loadtest        # en otra terminal, con el server corriendo: autocannon contra /health
```

Endpoints disponibles:

- `GET /health` - devuelve `{ "status": "ok", "pid": <pid del worker> }`.
- `GET /demo/bloqueante` - ejecuta un bucle síncrono pesado (bloquea el hilo principal).
- `GET /demo/asincrono` - espera con `setTimeout` (no bloquea el hilo principal).
- `GET /torneos`, `POST /torneos`, `PUT /torneos/:id`, `DELETE /torneos/:id`.
- `GET /jugadores`, `POST /jugadores`, `PUT /jugadores/:id`, `DELETE /jugadores/:id`.
- `GET /reportes/jugadores` - transmite `data/jugadores-ejemplo.csv` como NDJSON usando
  `Readable -> Transform -> Writable` con `pipeline()`, sin cargar el archivo completo en memoria.

Para comprobar la diferencia entre I/O bloqueante y no bloqueante: en una terminal llama a
`/demo/bloqueante` y, mientras corre, intenta `/health` desde otra terminal - se queda en cola
hasta que el bucle termina. Repite la prueba con `/demo/asincrono` y verás que `/health`
responde de inmediato aunque la demo aún esté "esperando".

## Herramientas de desarrollo

```bash
npm run lint           # ESLint sobre todo src/ (no-explicit-any, no-unused-vars, y tipo de
                        # retorno explícito obligatorio en domain/ y application/)
npm run lint:fix        # igual, pero corrige lo que se pueda automáticamente
npm run format          # Prettier --write sobre todo el repo
npm run format:check    # Prettier --check, sin modificar archivos (usado en CI más adelante)
```

Un hook de Git `pre-commit` (Husky + lint-staged) corre ESLint y Prettier solo sobre los
archivos en stage antes de permitir el commit. Un hook `commit-msg` (commitlint,
`@commitlint/config-conventional`) rechaza cualquier mensaje que no siga Conventional Commits
(`feat:`, `fix:`, `chore:`, etc.) - ambos hooks son obligatorios, no se pueden saltar sin
`--no-verify`.

**Nota de versión de TypeScript:** el proyecto usa `typescript@~6.0.3` (estable), no la 7.x
preview (`tsgo`) - `typescript-eslint` todavía no soporta TS 7 (ver
[issue #10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)), y una sola
versión de TypeScript para todo el toolchain (build + lint + futuro Jest) evita fricción
innecesaria.

## Arquitectura futura

A partir de la Semana 05 el proyecto migra a Clean Architecture (`domain/`, `application/`,
`infrastructure/`, `presentation/`), con Express, Prisma/Postgres, JWT + RBAC propios, Redis
y WebSockets.
