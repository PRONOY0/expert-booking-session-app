# Expert Session Booking System

A real-time expert session booking platform built with React, Node.js, Express, and MongoDB.

## Features

- Browse and search experts by name and category
- View available time slots grouped by date
- Real-time slot updates using Socket.io
- Book sessions with double booking prevention
- View your bookings by email with status tracking

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Socket.io-client
**Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io

## Getting Started

### Backend
cd backend
npm install
node index.js

### Frontend
cd frontend
npm install
npm run dev

## Environment Variables

Create a `.env` file in the backend folder:
DATABASE_URL=your_mongodb_connection_string
PORT=8000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/experts | Get all experts (pagination + filter) |
| GET | /api/experts/:id | Get expert with time slots |
| POST | /api/bookings | Create a booking |
| GET | /api/bookings?email= | Get bookings by email |
| PATCH | /api/bookings/:id/status | Update booking status |

## Live Demo

Frontend: https://expert-booking-session-app-1.onrender.com
Backend: https://expert-booking-session-app.onrender.com

## Note

Backend is hosted on Render free tier. First load may take
10-15 seconds if the server is inactive. Subsequent requests
will be instant.
