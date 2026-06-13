# PetConnect

PetConnect is a full-stack pet care platform that connects **pet owners** with **care providers** (dog walkers, vaccination services, and general pet care). Owners manage pet health records, browse providers, send hire requests, book appointments, and message providers in real time. Providers manage their profile, weekly availability, hire requests, bookings, and assigned pets from a dedicated dashboard.

## Features

### For pet owners
- Register and complete onboarding with profile setup
- Add and manage pets with photos, breed, weight history, and health notes
- Browse the provider directory with search, filters, and availability summaries
- Send **hire requests** and book only after a provider accepts
- Request appointments with date ranges and service types
- Real-time **messaging** with providers
- Dashboard with upcoming bookings and pet overview

### For care providers
- Register and set up a public profile (services, hourly rate, bio, gender)
- Configure **weekly availability** windows (day + time slots)
- Review and approve or reject incoming hire requests
- View and manage bookings
- Access pet records for pets assigned after hire approval
- Real-time messaging with owners

### Platform
- Role-based auth (Owner / Provider) with JWT
- REST API with Swagger docs
- PostgreSQL database with seed data for demos

## Live demo

| | URL |
| --- | --- |
| **App** | [https://petconnect-gilt.vercel.app](https://petconnect-gilt.vercel.app) |
| **API docs** | [https://petconnect-api-52ux.onrender.com/api](https://petconnect-api-52ux.onrender.com/api) |

After seeding locally (see below), you can also sign in with these demo accounts:

| Role | Email | Password |
| ---- | ----- | -------- |
| Owner | `seed-owner-0@petconnect.test` | `SeedPass123!` |
| Provider | `seed-provider-0@petconnect.test` | `SeedPass123!` |

---

## Run on your machine (Docker)

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

**1. Clone and open the project**

```bash
git clone https://github.com/abrkah/petconnect.git
cd petconnect
```

**2. Set up environment**

```bash
cp .env.example .env
```

**3. Start everything**

```bash
docker compose up --build
```

Wait until the build finishes. Then open:

- **App:** [http://localhost:3000](http://localhost:3000)
- **API docs:** [http://localhost:5003/api](http://localhost:5003/api)

**4. Load demo data** (run once, in a new terminal)

```bash
docker compose --profile seed run --rm seed
```

**5. Sign in** using the demo emails and password above.

---

## Run on your machine (without Docker)

**Requirements:** [Node.js](https://nodejs.org/) 20+ and [PostgreSQL](https://www.postgresql.org/) running locally.

**1. Clone the repo**

```bash
git clone https://github.com/abrkah/petconnect.git
cd petconnect
```

**2. Create the database**

Create a PostgreSQL database named `petcare` (user/password can match the defaults below).

**3. Start the API** (terminal 1)

```bash
cd backend/pet-care-app
cp .env.example .env
npm install
npm run build
npm run seed
npm run start:dev
```

API: [http://localhost:5003](http://localhost:5003) · Swagger: [http://localhost:5003/api](http://localhost:5003/api)

**4. Start the frontend** (terminal 2)

```bash
cd frontend/frontpet
npm install
```

Create `frontend/frontpet/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5003
```

Then run:

```bash
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

**5. Sign in** with the demo accounts listed above.

Default database settings in `backend/pet-care-app/.env`: host `localhost`, port `5432`, user `petconnect`, password `petconnect`, database `petcare`. Change them in `.env` if your Postgres setup differs.

---

## Stop the app (Docker)

```bash
docker compose down
```

To reset the database and start fresh:

```bash
docker compose down -v
docker compose up --build
docker compose --profile seed run --rm seed
```

---

## Project layout

```text
backend/pet-care-app/   → NestJS API (port 5003)
frontend/frontpet/      → Next.js app (port 3000)
```


