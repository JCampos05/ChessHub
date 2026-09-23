# ChessHub MX - Backend

Sistema de gestión integral de eventos y torneos de ajedrez (organización estatal/municipal,
con soporte para torneos nacionales asignados a un estado). 

## Estado actual

Semana 02 (`v1.1.0-native-routing`): router manual modular sobre `node:http` (GET/POST/PUT/DELETE),
parseo de body por streams, y rutas placeholder `/torneos` y `/jugadores` con arrays en memoria.
Sin base de datos ni dominio de ajedrez todavía.

## Uso

```bash
npm install
npm run dev
```

Endpoints disponibles:

- `GET /health` - devuelve `{ "status": "ok" }`.
- `GET /demo/bloqueante` - ejecuta un bucle síncrono pesado (bloquea el hilo principal).
- `GET /demo/asincrono` - espera con `setTimeout` (no bloquea el hilo principal).
- `GET /torneos` - lista los torneos en memoria.
- `POST /torneos` - crea un torneo (`{ "nombre": "..." }`, 400 si falta).
- `PUT /torneos/:id` - actualiza el nombre de un torneo (404 si no existe).
- `DELETE /torneos/:id` - elimina un torneo (204, o 404 si no existe).
- `GET /jugadores`, `POST /jugadores`, `PUT /jugadores/:id`, `DELETE /jugadores/:id` - mismo
  patrón que `/torneos`.

Para comprobar la diferencia entre I/O bloqueante y no bloqueante: en una terminal llama a
`/demo/bloqueante` y, mientras corre, intenta `/health` desde otra terminal - se queda en cola
hasta que el bucle termina. Repite la prueba con `/demo/asincrono` y verás que `/health`
responde de inmediato aunque la demo aún esté "esperando".

## Arquitectura futura

A partir de la Semana 05 el proyecto migra a Clean Architecture (`domain/`, `application/`,
`infrastructure/`, `presentation/`), con Express, Prisma/Postgres, JWT + RBAC propios, Redis
y WebSockets. 