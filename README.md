# InsightHub

Real-Time Collaborative Analytics Dashboard with Role-Based Access Control (RBAC).

## Features

* JWT Authentication
* Workspace Management
* Role-Based Access Control
* Dashboard Widgets
* Real-Time Collaboration
* React + Node.js + PostgreSQL

## Tech Stack

### Frontend

* React
* TypeScript
* Redux Toolkit
* React Query
* Ant Design

### Backend

* Node.js
* Express.js
* Prisma ORM
* Socket.io

### Database

* PostgreSQL

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create `.env` file in backend:

```env
PORT=5000

DATABASE_URL="postgresql://postgres:Admin123@localhost:5432/insighthub"

JWT_SECRET=supersecretkey
```

## Author

Prashant Kumar
