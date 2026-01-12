# Markdown Notes App

A full-stack markdown note-taking application with user authentication.

## Project Structure

```
markdown-notes/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express + PostgreSQL backend
└── README.md
```

## Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL database
- JWT authentication
- Vitest + Supertest for testing

**Frontend:**
- React + Vite
- react-markdown for rendering
- Vitest + React Testing Library for testing

**E2E Testing:**
- Playwright

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL installed and running

### Backend Setup
```bash
cd server
npm install
# Configure .env file with database credentials
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# E2E tests
npm run test:e2e
```

## Features

- User registration and authentication
- Create, edit, and delete markdown notes
- Live markdown preview
- Personal notes (users can only see their own notes)
- Full test coverage

## Learning Goals

This project demonstrates:
- RESTful API design
- Database schema design and relationships
- Authentication with JWT
- Frontend state management
- Test-driven development
- Full-stack integration
