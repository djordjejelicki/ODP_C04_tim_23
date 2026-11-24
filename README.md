# Hiking Management Application

A full-stack academic project for exploring hiking trails, organizing group hikes, and keeping a personal record of outdoor activities. Developed independently by Djordje Jelicki as part of university coursework.

## Features

- Browse mountains, trails, difficulty levels, and terrain tags.
- Maintain a personal trail list and record completed ascents, including duration, notes, and ratings.
- Organize scheduled group hikes and manage participants.
- Register and sign in with JWT-based authentication.
- View dashboard statistics and record application actions through audit logging.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL, mysql2 connection pool |
| Authentication | JWT, bcryptjs |

## Project structure

```text
client/                 React interface
server/src/Domain/      Models, DTOs, and interfaces
server/src/Services/    Application logic
server/src/Database/    Database connection and repositories
server/src/WebAPI/      Controllers and validation
server/src/Middlewares/ Request middleware
DB_Upiti.sql            MySQL schema dump
```

The backend separates HTTP handling, application logic, and database access. The frontend communicates with the REST API using Axios.

## Run locally

These instructions were prepared from the repository configuration; a fresh installation has not yet been verified end to end.

### Prerequisites

- Node.js compatible with Vite 7 (20.19+ or 22.12+) and npm.
- MySQL 8.x. The included schema was exported from MySQL 8.0.45.
- Git.

### 1. Get the project

```bash
git clone https://github.com/djordjejelicki/ODP_C04_tim_23.git
cd ODP_C04_tim_23
```

### 2. Prepare the database

Create an empty database named `trailsync`. In MySQL Workbench, open `DB_Upiti.sql`, select this database as the default schema, and execute the script.

Use a dedicated development database: the script drops and recreates its tables. It provides the schema; add your own sample data for demonstration.

### 3. Configure and start the backend

Create `server/.env` with your local values:

```dotenv
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=trailsync
JWT_SECRET=replace_with_a_long_random_secret
SALT_ROUNDS=10
```

Do not commit your `.env` file. The current connection pool enables TLS with `rejectUnauthorized: false`. Match this setting to your database: a local server without TLS requires adjusting the `ssl` option in `server/src/Database/connection/DbConnectionPool.ts`; a deployed server should use proper certificate verification.

```bash
cd server
npm install
npm run dev
```

The default API base URL is `http://localhost:5000/api/v1/`.

### 4. Configure and start the frontend

Create `client/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api/v1/
```

Keep the trailing slash: some API URLs are constructed by appending endpoint names.

In a separate terminal, from the repository root:

```bash
cd client
npm install
npm run dev
```

Open the address printed by Vite and create an account through the registration screen. Available actions depend on the user's role.

## Development commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `server` | `npm run typecheck` | Check TypeScript types |
| `server` | `npm run build` | Compile the backend |
| `server` | `npm start` | Run the compiled backend |
| `client` | `npm run lint` | Run ESLint |
| `client` | `npm run build` | Build the frontend |
| `client` | `npm run preview` | Preview the frontend build |

## Learning focus

This project provided practice in full-stack development, relational data modeling, REST APIs, authentication, validation, and separating responsibilities between controllers, services, and repositories.

<!-- Add screenshots here after capturing the running application with demo data.
Suggested views: trail catalog, hike details and participants, personal ascent history.
Store images in docs/screenshots/ and use relative Markdown image links.
-->
