# Flunk

> [!WARNING]
> This project is currently under active development. Features and functionality may change.

A full-stack monorepo application for managing and visualising game statistics.

## Project Structure

This project uses npm workspaces to manage three packages:

- **`packages/client`**: A React frontend built with Vite, TailwindCSS, React Query, Recharts, and React Router.
- **`packages/server`**: A Node.js and Express backend built with Prisma ORM (PostgreSQL), Swagger for API documentation, JWT authentication, and Zod for validation.
- **`packages/shared`**: Shared types and Zod schemas used by both the client and server.

## Features

- **Interactive UI**: A modern interface for exploring game interactions and data visualisation.
- **Statistics Dashboard**: Charts displaying statistics such as total matches, top games, and top players using Recharts.
- **Game Lists**: Sortable and filterable game lists.
- **Authentication**: Secure user authentication system using JWT.

## Prerequisites

- **Node.js**: v18 or newer recommended.
- **PostgreSQL**: A local installation or use the provided Docker Compose file.
- **Docker** (optional): For running the database via Docker Compose.

## Getting Started

### 1. Database Setup

You can start a local PostgreSQL database using the provided `docker-compose.yml` file:

```bash
docker-compose up -d
```

This will run a PostgreSQL container on `localhost:5432` with the user `flunk`, password `flunkpassword`, and database `flunk`.

### 2. Install Dependencies

In the root folder, install all workspace dependencies:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in `packages/server`. You will likely need the following based on the project configuration (e.g., Prisma and JWT):

```env
DATABASE_URL="postgresql://flunk:flunkpassword@localhost:5432/flunk?schema=public"
JWT_SECRET="your_jwt_secret_key"
```

### 4. Database Migration

Run Prisma migrations to set up the database schema for the first time:

```bash
cd packages/server
npm run prisma:generate
npm run prisma:migrate
cd ../..
```

### 5. Running the Application

From the root directory, you can start both the frontend and backend in development mode concurrently:

```bash
npm run dev
```

- The backend API will start securely with `ts-node-dev`.
- The Vite frontend will be available at the standard Vite port (usually `http://localhost:5173`).
- Swagger API documentation should be available via the server.

## Scripts

From the root of the workspace, you can run the following commands:

- `npm run dev`: Start all workspace packages in development mode.
- `npm run build`: Build all packages for production.
- `npm run lint`: Run ESLint across the workspace to check for code issues.
- `npm run test`: Run tests across the workspace.