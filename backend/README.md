# Backend

Express + Prisma API serving the frontend. Uses MySQL.

## Quick start (local with Docker)

1) Copy env template and adjust as needed

```
cp .env.example .env
```

2) Start MySQL

```
docker compose up -d
```

3) Install deps and generate Prisma client

```
npm install
npm run prisma:generate
```

4) Create tables from the Prisma schema (no migrations yet)

```
npm run prisma:push
```

5) Run the API

```
npm run dev
```

The API will be available on http://localhost:4000

If the frontend is running locally, it will use `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` by default.

## Environment variables

See `.env.example` for required values. The most important is `DATABASE_URL`.

## MySQL without Docker

1) Create a database (e.g. `asset_mgr`).
2) Set `DATABASE_URL` in `.env` to a valid MySQL connection string.
3) Run `npm run prisma:generate` and `npm run prisma:push`.
4) Start the server with `npm run dev`.

## Notes

- The current schema uses `db push` to sync tables. When you are ready to adopt migrations, replace with `prisma migrate` flows.
- Example resources exposed: `/api/assets`, `/api/categories`, `/api/suppliers`, etc.