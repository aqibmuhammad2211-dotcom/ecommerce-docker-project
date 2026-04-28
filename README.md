# E-Commerce App — Full Stack with Docker

A production-ready full-stack e-commerce application built with Next.js, Directus CMS, PostgreSQL, and Docker Compose.

## Live Demo
> Coming soon — deployment in progress

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| CMS / API | Directus |
| Database | PostgreSQL 15 |
| Containerization | Docker, Docker Compose |

## Features

- Multi-container Docker setup with health checks
- Network isolation (backend/frontend networks)
- Production-ready multi-stage Docker builds
- Environment-based configuration
- Auto-restart on failure
- CMS-powered product management via Directus
- Server-side rendered product listing page

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│   Directus  │────▶│  PostgreSQL  │
│  (port 3000)│     │ (port 8055) │     │ (port 5432) │
└─────────────┘     └─────────────┘     └─────────────┘
  frontend net         both nets           backend net
```

## Getting Started

### Prerequisites
- Docker Desktop installed
- Docker Compose v2+

### Setup

1. Clone the repository:
```bash
git clone https://github.com/aqibmuhammad2211-dotcom/ecommerce-docker-project.git
cd ecommerce-docker-project
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your values:
```env
POSTGRES_USER=directus
POSTGRES_PASSWORD=your_password
POSTGRES_DB=directus
SECRET=your-secret-key-minimum-32-characters
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

4. Run the project:
```bash
docker compose up --build
```

5. Access the app:
- **Frontend:** http://localhost:3000
- **Directus Admin:** http://localhost:8055/admin

## Project Structure

```
my-compose-project/
├── docker-compose.yml      # Multi-container orchestration
├── .env.example            # Environment variables template
├── .gitignore
└── frontend/
    ├── Dockerfile          # Multi-stage production build
    ├── app/
    │   ├── page.tsx        # Product listing page
    │   └── layout.tsx
    └── package.json
```

## DevOps Highlights

- **Health checks** on all services — no race conditions on startup
- **depends_on with condition: service_healthy** — services start in correct order
- **Multi-stage Dockerfile** — optimized image size (~200MB vs ~1GB)
- **Network isolation** — database not exposed to frontend
- **restart: unless-stopped** — production-grade reliability

## Author

**Aqib Muhammad**
- GitHub: [@aqibmuhammad2211-dotcom](https://github.com/aqibmuhammad2211-dotcom)
- Available for freelance DevOps & Full Stack work
