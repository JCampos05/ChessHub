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

## Arquitectura futura

A partir de la Semana 05 el proyecto migra a Clean Architecture (`domain/`, `application/`,
`infrastructure/`, `presentation/`), con Express, Prisma/Postgres, JWT + RBAC propios, Redis
y WebSockets. 