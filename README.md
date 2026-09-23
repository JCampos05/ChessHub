# ChessHub MX - Backend

Sistema de gestión integral de eventos y torneos de ajedrez (organización estatal/municipal,
con soporte para torneos nacionales asignados a un estado). 

## Estado actual

Semana 01 (`v1.0.0-http-core`): servidor HTTP nativo (`node:http`, sin frameworks) con un
endpoint de salud y una demo del event loop. Sin lógica de dominio de ajedrez todavía.

## Uso

```bash
npm install
npm run dev
```

Endpoints disponibles:

- `GET /health` — devuelve `{ "status": "ok" }`.
- `GET /demo/bloqueante` — ejecuta un bucle síncrono pesado (bloquea el hilo principal).
- `GET /demo/asincrono` — espera con `setTimeout` (no bloquea el hilo principal).

Para comprobar la diferencia entre I/O bloqueante y no bloqueante: en una terminal llama a
`/demo/bloqueante` y, mientras corre, intenta `/health` desde otra terminal — se queda en cola
hasta que el bucle termina. Repite la prueba con `/demo/asincrono` y verás que `/health`
responde de inmediato aunque la demo aún esté "esperando".

## Arquitectura futura

A partir de la Semana 05 el proyecto migra a Clean Architecture (`domain/`, `application/`,
`infrastructure/`, `presentation/`), con Express, Prisma/Postgres, JWT + RBAC propios, Redis
y WebSockets. 