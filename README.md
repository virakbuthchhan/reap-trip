# Reap Trip

Dockerized deployment for this Next.js 14 application.

## Prerequisites

- Docker
- Docker Compose (v2)

## Run with Docker Compose

```bash
docker compose up --build
```

App will be available at `http://localhost:3000`.

To change the exposed port:

```bash
APP_PORT=8080 docker compose up --build
```

## Run in background (deploy mode)

```bash
docker compose up -d --build
```

Check status:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f app
```

Stop:

```bash
docker compose down
```

## Build and run without Compose

```bash
docker build -t reap-trip:latest .
docker run --rm -p 3000:3000 reap-trip:latest
```
