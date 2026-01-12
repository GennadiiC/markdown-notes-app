# Backend API - Markdown Notes App

RESTful API for the Markdown Notes application with user authentication and CRUD operations.

## Tech Stack

- Node.js + Express
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing
- Vitest + Supertest for testing

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **PostgreSQL** - [Download](https://www.postgresql.org/download/)

### Installing PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Windows
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Setting up PostgreSQL Database

1. **Access PostgreSQL:**
```bash
# macOS/Linux
psql postgres

# Windows (use SQL Shell from Start Menu)
```

2. **Create database and user:**
```sql
CREATE DATABASE markdown_notes;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE markdown_notes TO your_username;
\q
```

## Setup Instructions

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=markdown_notes
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_random_secret_key_here
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. **Set up database tables:**
```bash
npm run db:setup
```

This will create the `users` and `notes` tables.

4. **Start the development server:**
```bash
npm run dev
```

The server will run on `http://localhost:3000` with auto-reload on file changes.

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john",
  "password": "password123"
}
```

### Notes (requires authentication)

All notes endpoints require the `Authorization` header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get all notes
```http
GET /api/notes
```

#### Get a specific note
```http
GET /api/notes/:id
```

#### Create a new note
```http
POST /api/notes
Content-Type: application/json

{
  "title": "My First Note",
  "content": "# Hello\n\nThis is **markdown** content."
}
```

#### Update a note
```http
PUT /api/notes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content here."
}
```

#### Delete a note
```http
DELETE /api/notes/:id
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Database Schema

### Users Table
```sql
id            SERIAL PRIMARY KEY
username      VARCHAR(50) UNIQUE NOT NULL
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

### Notes Table
```sql
id         SERIAL PRIMARY KEY
user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE
title      VARCHAR(255) NOT NULL
content    TEXT NOT NULL
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## Project Structure

```
server/
├── controllers/        # Route controllers
│   ├── authController.js
│   └── notesController.js
├── middleware/        # Custom middleware
│   └── auth.js
├── routes/           # API routes
│   ├── auth.js
│   └── notes.js
├── tests/            # Test files
│   ├── auth.test.js
│   └── notes.test.js
├── db.js             # Database connection
├── index.js          # Main server file
├── schema.sql        # Database schema
└── setupDb.js        # Database setup script
```

## Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for authentication (24h expiration)
- Protected routes with JWT middleware
- User can only access their own notes
- SQL injection prevention with parameterized queries

## Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running:**
```bash
# macOS/Linux
pg_isready

# Or check the service
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux
```

2. **Verify database exists:**
```bash
psql -U your_username -d markdown_notes -c "\dt"
```

3. **Check .env configuration matches your PostgreSQL setup**

### Port Already in Use

If port 3000 is in use, change `PORT` in `.env` file.

## Development Tips

- Use `npm run dev` for development with auto-reload
- Check server logs for detailed error messages
- Test endpoints with Postman, Insomnia, or curl
- Backend tests run against the actual database, ensure it's set up correctly
