# PetConnect

## Run with Docker

1. Copy environment file:

```bash
cp .env.example .env
```

2. Start Postgres, API, and frontend:

```bash
docker compose up --build
```

3. Seed demo data (first time or after a reset):

```bash
docker compose --profile seed run --rm seed
```

### URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:5003 |
| Swagger | http://localhost:5003/api |

### Demo logins (after seed)

Password for all seed users: **`SeedPass123!`**

| Role | Email |
|------|-------|
| Owner (showcase) | `seed-owner-0@petconnect.test` |
| Provider (showcase) | `seed-provider-0@petconnect.test` |

### Useful commands

```bash
# Stop
docker compose down

# Stop and remove database volume
docker compose down -v

# API logs
docker compose logs -f api

# Re-seed
docker compose --profile seed run --rm seed
```
