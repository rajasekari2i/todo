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

### Database

| Command | Description |
|---------|-------------|
| `npm run db:migrate --workspace=server` | Run database migrations |
| `npm run db:seed --workspace=server` | Seed the database |

### Docker (Optional)

| Command | Description |
|---------|-------------|
| `npm run docker:up` | Start all services with Docker Compose |
| `npm run docker:down` | Stop all Docker services |
| `npm run docker:build` | Build Docker images |

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
