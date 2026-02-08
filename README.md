# Adcash Influencer Offer Management

## Tech Stack

**Backend**
- Node.js 22 + Express + TypeScript
- Drizzle ORM + PostgreSQL
- Zod validation
- Swagger/OpenAPI documentation

**Frontend**
- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- TanStack React Query

## Quick Start (Docker)

The easiest way to run the application:

```bash
docker compose up --build
```

This single command will:
- Start PostgreSQL database
- Create database schema automatically
- Seed sample data (3 influencers, 5 offers, 2 custom payouts)
- Start the backend API
- Build and serve the frontend

Once running:
- **Application**: http://localhost:8080
- **API Documentation**: http://localhost:8080/api/docs

To stop and remove containers, networks, and volumes:

```bash
docker compose down -v
```

## Local Development

### Prerequisites

- Node.js >= 22
- pnpm >= 10
- Docker (for PostgreSQL)

### Setup

```bash
# Start PostgreSQL
docker compose up postgres -d

# Install dependencies
pnpm install

# Copy environment file
cp packages/backend/.env.example packages/backend/.env

# Initialize database
pnpm --filter @adcash/backend db:push
pnpm --filter @adcash/backend db:seed

# Start development servers (in separate terminals)
pnpm --filter @adcash/backend dev
pnpm --filter @adcash/frontend dev
```

## API

All API endpoints and schemas are documented in Swagger:

- http://localhost:8080/api/docs

## Key Features

- **Influencer Management**: List influencers and create new influencers
- **Offer Management**: Create, update, and delete offers with `cpa`, `fixed`, and `cpa_fixed` payout types
- **Custom Payout Overrides**: Create and remove influencer-specific custom payouts per offer
- **Search**: Filter influencer offer results by offer title
- **Validation**: Enforce payout-type-specific amount requirements via backend schema validation

