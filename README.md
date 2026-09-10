# Product Management Dashboard

A full-stack CRUD application for managing products — FastAPI backend, React frontend, SQLite persistence, fully containerized with Docker Compose.

## Setup

1. Clone the repository.
2. Copy `.env.example` to `.env` and adjust values if needed:
   ```
   cp .env.example .env
   ```
3. Ensure Docker and Docker Compose are installed.

## Run

Start the full application with a single command:

```bash
docker compose up --build
```

- Frontend: http://localhost:4173
- Backend API: http://localhost:8000
- Interactive API docs (Swagger UI): http://localhost:8000/docs

To stop:

```bash
docker compose down
```

Data persists in a named Docker volume (`product_data`), so products remain after `docker compose down` / `docker compose up` again. To wipe data entirely, run `docker compose down -v`.

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI app, routes, CORS
│   │   ├── models.py       # SQLAlchemy ORM model
│   │   ├── schemas.py      # Pydantic validation schemas
│   │   ├── crud.py         # DB access functions
│   │   └── database.py     # DB engine/session setup
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main dashboard component
│   │   ├── api.js               # Fetch calls to backend
│   │   └── components/
│   │       ├── ProductTable.jsx
│   │       └── ProductForm.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|-----------------------|
| GET    | `/api/products`       | List all products     |
| GET    | `/api/products/{id}`  | Get a single product  |
| POST   | `/api/products`       | Create a product      |
| PUT    | `/api/products/{id}`  | Update a product      |
| DELETE | `/api/products/{id}`  | Delete a product      |

**Product fields:** `id`, `name`, `sku`, `price`, `status` (`active` / `inactive` / `discontinued`), `created_at`

## Environment Variables

| Variable        | Used by  | Description                                  |
|-----------------|----------|-----------------------------------------------|
| `DATABASE_URL`  | backend  | SQLAlchemy database connection string         |
| `CORS_ORIGINS`  | backend  | Comma-separated list of allowed frontend origins |
| `VITE_API_URL`  | frontend | Base URL of the backend API (baked in at build time) |
