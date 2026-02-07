# Todo Application

A full-stack Todo application built with React, Node.js, Express, and PostgreSQL.

## Features

- User authentication (Register/Login)
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Categorize todos with custom categories
- Add tags to todos
- Set due dates and reminders
- Filter todos by status, priority, and category
- Real-time notifications via WebSocket
- Responsive design

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Headless UI
- React Router
- Socket.io Client

### Backend
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- JWT Authentication
- Socket.io

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd favorites-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example environment file and update with your settings:
   ```bash
   cp .env.example .env
   cp .env server/.env
   ```

   Update the `.env` file with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=todo_app
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

4. **Create the database**
   ```bash
   psql -U postgres -c "CREATE DATABASE todo_app;"
   ```

   The tables will be created automatically when the server starts.

## Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server in development mode |
| `npm run dev:client` | Start only the frontend (http://localhost:5173) |
| `npm run dev:server` | Start only the backend (http://localhost:3001) |

### Production

| Command | Description |
|---------|-------------|
| `npm run build` | Build both client and server for production |

### Testing

| Command | Description |
|---------|-------------|
| `npm run test` | Run tests for all workspaces |
| `npm run lint` | Run linting for all workspaces |

### E2E Testing (Playwright)

End-to-end browser tests run against the Docker-hosted application using Playwright with Chromium.

#### Prerequisites

- Docker containers must be running (`sudo docker compose up -d --build`)
- Install dependencies: `npm install`

#### Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all E2E tests headless |
| `npm run test:e2e:headed` | Run tests in a visible Chrome window |
| `npm run test:e2e:ui` | Open interactive Playwright UI |
| `npx playwright show-report` | View HTML test report |

#### Test Report Summary

```
Running 17 tests using 1 worker

  auth.spec.js
    ✓ Authentication › should register a new user
    ✓ Authentication › should login with valid credentials
    ✓ Authentication › should show error for invalid login
    ✓ Authentication › should redirect unauthenticated user to login
    ✓ Authentication › should navigate between login and register pages

  categories.spec.js
    ✓ Categories & Tags › should create a new category
    ✓ Categories & Tags › should edit a category
    ✓ Categories & Tags › should delete a category
    ✓ Categories & Tags › should create and delete a tag

  dashboard.spec.js
    ✓ Dashboard › should display stats cards
    ✓ Dashboard › should display quick actions
    ✓ Dashboard › should navigate via sidebar links

  todos.spec.js
    ✓ Todos › should create a new todo
    ✓ Todos › should edit an existing todo
    ✓ Todos › should toggle todo completion
    ✓ Todos › should delete a todo
    ✓ Todos › should filter todos by search

  17 passed (16.1s)
```

#### Test Coverage

| Spec File | Tests | What's Covered |
|-----------|-------|----------------|
| `auth.spec.js` | 5 | Registration, login, invalid credentials, auth redirect, page navigation |
| `dashboard.spec.js` | 3 | Stats cards, quick action links, sidebar navigation |
| `todos.spec.js` | 5 | Create, edit, toggle complete, delete, search/filter |
| `categories.spec.js` | 4 | Create/edit/delete category, create/delete tag |

#### Test Architecture

- **Browser**: Chromium (via Playwright)
- **Execution**: Serial (single worker) to avoid database conflicts
- **State isolation**: Playwright creates a fresh BrowserContext per test, clearing localStorage, cookies, and cache
- **Auth fixture**: Each authenticated test registers a new user with a unique email, ensuring complete isolation
- **Base URL**: `http://localhost` (Nginx-served React client on port 80)

### Database

| Command | Description |
|---------|-------------|
| `npm run db:migrate --workspace=server` | Run database migrations |
| `npm run db:seed --workspace=server` | Seed the database |

### Docker

#### Prerequisites
- Docker Engine installed ([Install Docker](https://docs.docker.com/engine/install/ubuntu/))
- Docker Compose plugin

#### Start the Application

```bash
# Build and start all services (PostgreSQL, Server, Client) in detached mode
sudo docker compose up -d --build
```

This starts three containers:
| Container | Service | Port |
|-----------|---------|------|
| `todo_db` | PostgreSQL 15 | 5433 (host) → 5432 (container) |
| `todo_server` | Node.js API | 3001 |
| `todo_client` | Nginx (React) | 80 |

Once running, open **http://localhost** in your browser.

#### Check Container Status

```bash
# View running containers
sudo docker compose ps

# View logs for all services
sudo docker compose logs

# View logs for a specific service
sudo docker compose logs server
sudo docker compose logs client
sudo docker compose logs db

# Follow logs in real-time
sudo docker compose logs -f
```

#### Stop the Application

```bash
# Stop all containers (keeps data)
sudo docker compose down

# Stop and remove all data (including database volume)
sudo docker compose down -v

# Stop a specific service
sudo docker compose stop server
```

#### Restart Services

```bash
# Restart all services
sudo docker compose restart

# Restart a specific service
sudo docker compose restart server

# Rebuild and restart (after code changes)
sudo docker compose up -d --build
```

## Project Structure

```
favorites-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context providers
│   │   ├── services/       # API and socket services
│   │   └── main.jsx        # Application entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   └── index.js        # Server entry point
│   └── package.json
├── e2e/                    # Playwright E2E tests
│   ├── fixtures/
│   │   └── auth.fixture.js # Reusable auth helper (register + login)
│   └── tests/
│       ├── auth.spec.js        # Authentication tests (5)
│       ├── dashboard.spec.js   # Dashboard tests (3)
│       ├── todos.spec.js       # Todo CRUD tests (5)
│       └── categories.spec.js  # Categories & tags tests (4)
├── playwright.config.js    # Playwright configuration
├── .env                    # Environment variables
├── docker-compose.yml      # Docker configuration
└── package.json            # Root package.json (workspaces)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get all todos (with filters)
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a tag
- `DELETE /api/tags/:id` - Delete a tag

### Notifications
- `GET /api/notifications` - Get all notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all as read

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | todo_app |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `SERVER_PORT` | Backend server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `VITE_API_URL` | API URL for frontend | http://localhost:3001/api |

## License

MIT
