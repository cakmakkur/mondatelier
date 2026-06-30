# Mondatelier

Mondatelier is a React/Vite frontend backed by a Spring Boot/PostgreSQL API.
The current architecture direction and migration plan are documented in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Prerequisites

- Java 21 or newer
- Node 22 and npm 11
- PostgreSQL for local development

## Local configuration

Copy the example values and provide real local secrets through the environment:

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Spring does not automatically load `backend/.env`; export those variables in
your shell or configure them in the IDE.

## Run

```sh
cd backend
./mvnw spring-boot:run
```

In another shell:

```sh
cd frontend
npm ci
npm run dev
```

## Verify

```sh
cd frontend
npm run check
npm run build

cd ../backend
./mvnw test
```

Repository-specific contributor guidance is in the `AGENTS.md` files.
