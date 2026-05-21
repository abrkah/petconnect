# Deploy PetConnect for free (detailed guide)

This guide walks you through deploying the full app using **only free tiers**:

| Part | Service | What it runs |
|------|---------|----------------|
| Database | [Neon](https://neon.tech) | PostgreSQL |
| API | [Render](https://render.com) | NestJS backend |
| Frontend | [Vercel](https://vercel.com) | Next.js app |

**Total cost:** $0 (within free limits).

**Before you start, you need:**

- A [GitHub](https://github.com) account
- Your `petconnect` code pushed to GitHub (see Part 0)
- About 45–60 minutes the first time

---

## Part 0 — Push your code to GitHub

Render and Vercel deploy from GitHub. Skip this if the repo is already at `https://github.com/abrkah/petconnect`.

### 0.1 Open Terminal in the project

```bash
cd /Users/ab/Desktop/project/petconnect
```

### 0.2 Check status

```bash
git status
git remote -v
```

You should see `origin` pointing to your GitHub repo.

### 0.3 Commit and push (if you have local changes)

```bash
git add .
git restore --staged .env 2>/dev/null || true
git commit -m "Prepare for free cloud deploy"
git push origin main
```

### 0.4 Confirm on GitHub

1. Open https://github.com/abrkah/petconnect in a browser.
2. Confirm you see folders: `backend/`, `frontend/`, `docker-compose.yml`, `DEPLOY.md`.

---

## Part 1 — Database on Neon (deep)

Neon hosts PostgreSQL in the cloud. Your API on Render will connect to it over the internet.

### 1.1 Create a Neon account

1. Go to https://neon.tech
2. Click **Sign up** (GitHub or Google is easiest).
3. Complete signup and open the **Neon Console** (dashboard).

### 1.2 Create a project

1. Click **New Project** (or **Create a project**).
2. **Project name:** `petconnect` (any name is fine).
3. **Postgres version:** leave default (16).
4. **Region:** pick one close to you (e.g. `US East` if you are in the US).
5. Click **Create project**.

Neon creates an empty database and shows the project dashboard.

### 1.3 Get the connection string

1. On the project page, find **Connection details** (or **Connect**).
2. You will see two connection types:
   - **Pooled** — good for many short connections.
   - **Direct** — fine for Render (one long-running server).

   For Render, **either works**; **Direct** is slightly simpler for a first deploy.

3. Click **Copy** on the connection string. It looks like:

   ```text
   postgresql://neondb_owner:AbCdEf123456@ep-cool-name-12345678.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

4. **Save this somewhere safe** (Notes app, password manager). You will paste it into Render as `DATABASE_URL`.

   **Important:**
   - Keep `?sslmode=require` at the end (SSL).
   - Do not share this URL publicly (it contains your DB password).

### 1.4 Optional — rename the database

Neon’s default database name is often `neondb`. That is fine. You do not need to change it unless you want the name `petcare` for clarity — the connection string already includes the DB name.

### 1.5 Test connection (optional)

In Neon console, open **SQL Editor**, run:

```sql
SELECT 1;
```

If you get a result, the database is alive.

**You are done with Neon for now.** Tables are created automatically when the API starts (`DATABASE_SYNC=true`).

---

## Part 2 — API on Render (deep)

Render runs your NestJS API 24/7 (free tier may **sleep** when idle).

### 2.1 Create a Render account

1. Go to https://render.com
2. Click **Get Started** → sign in with **GitHub**.
3. Authorize Render to access your repositories when asked.

### 2.2 Create a new Web Service

1. From the Render dashboard, click **New +** (top right).
2. Choose **Web Service**.
3. **Connect a repository:**
   - If asked, **Configure account** and give Render access to `abrkah/petconnect`.
   - Find **petconnect** in the list and click **Connect**.

### 2.3 Configure the service (every field)

Fill in the form carefully:

| Field | What to enter | Why |
|-------|----------------|-----|
| **Name** | `petconnect-api` | Becomes part of your URL: `petconnect-api.onrender.com` |
| **Region** | Same region as Neon if possible | Lower latency |
| **Branch** | `main` | Deploys latest code |
| **Root Directory** | `backend/pet-care-app` | NestJS app lives here, not repo root |
| **Runtime** | `Node` | |
| **Build Command** | `npm ci && npm run build` | Installs deps and compiles TypeScript |
| **Start Command** | `node dist/main.js` | Runs production build |
| **Instance type** | **Free** | |

Leave **Docker** off (we use native Node, not Docker on Render for this guide).

### 2.4 Add environment variables (before first deploy)

Scroll to **Environment Variables** → **Add Environment Variable** for each row:

| Key | Value | Notes |
|-----|--------|--------|
| `NODE_ENV` | `production` | |
| `DATABASE_URL` | *(paste full Neon connection string)* | From Part 1.3 |
| `JWT_SECRET` | *(see below)* | Must be long and random |
| `JWT_EXPIRE_IN` | `86400` | Token lifetime in seconds (1 day) |
| `DATABASE_SYNC` | `true` | Auto-creates tables (OK for demo; not for serious production) |
| `FRONTEND_URL` | `https://placeholder.vercel.app` | **Temporary** — update after Vercel in Part 4 |

**Generate `JWT_SECRET`:**

On your Mac Terminal:

```bash
openssl rand -base64 32
```

Copy the output and paste as `JWT_SECRET`.

**Do not add `PORT`** — Render sets `PORT` automatically (usually `10000`).

### 2.5 Deploy

1. Click **Create Web Service** (bottom).
2. Render starts **Building** — first build often takes **5–10 minutes**.
3. Watch the **Logs** tab:
   - Build should run `npm ci` then `npm run build`.
   - When build succeeds, you should see Nest logs and eventually something like the app listening.

### 2.6 If the build fails

Common fixes:

| Log error | Fix |
|---------|-----|
| `Cannot find module` | Confirm **Root Directory** is `backend/pet-care-app` |
| TypeScript errors | Fix locally, push to GitHub; Render auto-redeploys |
| Database connection | Check `DATABASE_URL` is complete with `sslmode=require` |

### 2.7 Get your API URL

1. At the top of the service page, Render shows a URL like:
   ```text
   https://petconnect-api.onrender.com
   ```
2. **Copy and save it** — you need it for Vercel.

### 2.8 Test the API

1. Open in browser:
   ```text
   https://YOUR-SERVICE-NAME.onrender.com
   ```
   You may see a short hello text from the API root.

2. Open Swagger:
   ```text
   https://YOUR-SERVICE-NAME.onrender.com/api
   ```
   You should see API documentation.

3. **First request after idle:** free tier may take **30–60 seconds** to wake up. That is normal.

---

## Part 3 — Seed the production database (deep)

The live database is empty until you run the seed script.

### 3.1 Open Render Shell

1. Render dashboard → click your **petconnect-api** service.
2. Left sidebar → **Shell** (or **Connect** → Shell).
3. Wait until a terminal opens inside the container.

### 3.2 Run seed

In the Render shell:

```bash
npm run seed
```

**What you should see:**

- Nest boot messages
- `Clearing existing PetConnect tables…`
- `Seed complete. Row counts: { user: 20, pet: 40, ... }`
- Showcase owner/provider emails printed

**If it fails:**

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` / database | `DATABASE_URL` wrong on Render → Environment → fix → redeploy |
| TypeScript / module errors | Redeploy latest code from GitHub |

### 3.3 Alternative — seed from your Mac

If Render Shell does not work:

```bash
cd /Users/ab/Desktop/project/petconnect/backend/pet-care-app
DATABASE_URL="postgresql://YOUR-NEON-STRING-HERE" npm run seed
```

Use the **same** Neon URL as on Render.

---

## Part 4 — Frontend on Vercel (deep)

Vercel hosts the Next.js app and gives you a public HTTPS URL.

### 4.1 Create a Vercel account

1. Go to https://vercel.com
2. **Sign Up** → **Continue with GitHub**.
3. Authorize Vercel.

### 4.2 Import the project

1. Dashboard → **Add New…** → **Project**.
2. **Import** the `petconnect` repository (same GitHub repo).
3. If you do not see it, click **Adjust GitHub App Permissions** and allow access to the repo.

### 4.3 Configure the project (critical)

On the import screen **before** Deploy:

| Field | Value |
|-------|--------|
| **Project Name** | `petconnect` (or any name — affects URL) |
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | Click **Edit** → set to `frontend/frontpet` |

**Why Root Directory matters:** the Next app is not at the repo root; it is inside `frontend/frontpet`.

**Wrong site on Vercel?** If you see an old page (“WELCOME TO PETCONNECT”, HOME / BROWSE / SOCIAL nav) instead of the teal landing (“Care for every pet, one calm dashboard”):

1. **Root Directory** must be exactly `frontend/frontpet` (not empty, not `/`).
2. **Deployments** → latest must be **Ready** (not Error). Failed builds leave **Production** on an old deploy.
3. Pull latest `main` (includes Next.js 15.2.8) and **Redeploy**.
4. After a green deploy, open the new deployment URL or **Promote to Production**.

### 4.4 Environment variables on Vercel

Expand **Environment Variables**:

| Key | Value | Environments |
|-----|--------|----------------|
| `NEXT_PUBLIC_API_URL` | `https://petconnect-api.onrender.com` | Production, Preview, Development |

**Rules:**

- Use **your real** Render URL from Part 2.7.
- **https** only, no trailing slash:
  - Good: `https://petconnect-api.onrender.com`
  - Bad: `https://petconnect-api.onrender.com/`
  - Bad: `http://...`

`NEXT_PUBLIC_*` is embedded in the browser bundle at **build time**. If you change it later, you must **redeploy** Vercel.

### 4.5 Deploy

1. Click **Deploy**.
2. Build takes **2–5 minutes** (first time).
3. When done, Vercel shows **Congratulations** and a URL like:
   ```text
   https://petconnect.vercel.app
   ```
   or
   ```text
   https://petconnect-abrkah.vercel.app
   ```

4. **Copy your live frontend URL.**

### 4.6 Test the frontend (before CORS fix)

Open:

```text
https://YOUR-APP.vercel.app/login
```

Login might **fail** until you set `FRONTEND_URL` on Render (Part 5). That is expected.

---

## Part 5 — Connect API and frontend (deep)

The API only allows browser requests from your Vercel URL (CORS). Both sides must know each other’s URLs.

### 5.1 Update Render: `FRONTEND_URL`

1. Render → **petconnect-api** → **Environment**.
2. Find `FRONTEND_URL` (you set a placeholder earlier).
3. Change it to your **exact** Vercel URL, e.g.:
   ```text
   https://petconnect.vercel.app
   ```
   No trailing slash.
4. Click **Save Changes**.
5. Render will **automatically redeploy** the API (wait until status is **Live**).

### 5.2 Confirm Vercel: `NEXT_PUBLIC_API_URL`

1. Vercel → your project → **Settings** → **Environment Variables**.
2. Confirm `NEXT_PUBLIC_API_URL` = your Render API URL.
3. If you changed it:
   - **Deployments** → latest deployment → **⋯** → **Redeploy**.

### 5.3 How the connection works

```text
Browser  →  Vercel (Next.js)     https://petconnect.vercel.app
Browser  →  Render (Nest API)    https://petconnect-api.onrender.com
Render   →  Neon (Postgres)      DATABASE_URL (private connection)
```

The browser never talks to Neon directly. Only the API does.

---

## Part 6 — Test the live app (deep)

### 6.1 Open login

```text
https://YOUR-APP.vercel.app/login
```

### 6.2 Log in as owner

| Field | Value |
|-------|--------|
| Email | `seed-owner-0@petconnect.test` |
| Password | `SeedPass123!` |

You should land on the **owner dashboard** with pets, charts, and bookings.

### 6.3 Log in as provider (new incognito window)

| Field | Value |
|-------|--------|
| Email | `seed-provider-0@petconnect.test` |
| Password | `SeedPass123!` |

You should see the **provider dashboard** with managed pets and bookings.

### 6.4 If login fails — debug checklist

1. **Browser DevTools** (F12) → **Network** tab → try login.
2. Look for a red request to your API (e.g. `/auth/login`).

| Status / error | Fix |
|----------------|-----|
| Failed / CORS | `FRONTEND_URL` on Render must match Vercel URL exactly; redeploy API |
| 404 | Wrong `NEXT_PUBLIC_API_URL` on Vercel; redeploy Vercel |
| 401 / 500 | API logs on Render → **Logs** tab |
| Network timeout | Render sleeping; wait 60s and retry |
| 401 invalid credentials | Run `npm run seed` again (Part 3) |

3. Test API directly (optional):

   ```bash
   curl -X POST https://YOUR-API.onrender.com/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"seed-owner-0@petconnect.test","password":"SeedPass123!"}'
   ```

   A successful response includes an `access_token` or similar.

---

## Part 7 — After deploy (updates & limits)

### 7.1 Deploying code changes

1. Push to GitHub `main`:
   ```bash
   git push origin main
   ```
2. **Render** auto-rebuilds the API.
3. **Vercel** auto-rebuilds the frontend.

### 7.2 Free tier limits you should know

| Service | Limit | What you notice |
|---------|--------|------------------|
| Render | Spins down after ~15 min idle | Slow first API request |
| Render | 750 hours/month free | Enough for one service |
| Neon | Storage / compute caps | Fine for demo |
| Vercel | Hobby bandwidth/builds | Fine for demo |

### 7.3 Pet photo uploads

Files uploaded on Render are stored on **temporary disk**. They are **lost** when Render redeploys. Seeded pets use **Unsplash URLs** and still show images. For permanent uploads you would need S3/Cloudinary (paid setup, not in this guide).

### 7.4 Custom domain (optional, still free on Vercel)

Vercel → Project → **Settings** → **Domains** → add your domain.  
Then update `FRONTEND_URL` on Render to that domain.

---

## Quick reference — all URLs and env vars

### Neon

- Console: https://console.neon.tech
- Save: `DATABASE_URL`

### Render (API)

- Dashboard: https://dashboard.render.com
- URL: `https://<your-service>.onrender.com`
- Env:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRE_IN=86400`
  - `FRONTEND_URL=<vercel-url>`
  - `DATABASE_SYNC=true`
  - `NODE_ENV=production`

### Vercel (frontend)

- Dashboard: https://vercel.com/dashboard
- URL: `https://<your-project>.vercel.app`
- Env:
  - `NEXT_PUBLIC_API_URL=<render-api-url>`

### Demo users (after seed)

| Role | Email | Password |
|------|--------|----------|
| Owner | `seed-owner-0@petconnect.test` | `SeedPass123!` |
| Provider | `seed-provider-0@petconnect.test` | `SeedPass123!` |

---

## Full checklist

- [ ] Code on GitHub
- [ ] Neon project created
- [ ] `DATABASE_URL` copied
- [ ] Render web service created (`backend/pet-care-app`)
- [ ] All Render env vars set
- [ ] Render deploy **Live**
- [ ] `/api` Swagger loads
- [ ] `npm run seed` completed
- [ ] Vercel project created (`frontend/frontpet`)
- [ ] `NEXT_PUBLIC_API_URL` set on Vercel
- [ ] Vercel deploy successful
- [ ] `FRONTEND_URL` on Render = Vercel URL
- [ ] Login works on live site

---

## Optional — Render Blueprint

The repo includes `render.yaml`. On Render: **New +** → **Blueprint** → select `petconnect` → follow prompts to enter `DATABASE_URL` and `FRONTEND_URL`. This automates Part 2.3–2.4 but manual setup above is easier to debug the first time.
