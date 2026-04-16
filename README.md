# TypeFlow Backend Setup

This project now includes a Node.js + MongoDB backend and serves the frontend through Express.

## 1. Configure environment

Create a `.env` file from `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/typeflow
```

## 2. Start MongoDB

Make sure your MongoDB server is running locally, or point `MONGODB_URI` to MongoDB Atlas.

## 3. Run the app

```bash
npm install
npm start
```

Then open:

`http://localhost:3000`

## What changed

- User registration and login now use MongoDB.
- Practice, upload, and contest sessions now save through the backend.
- Analytics loads sessions from the backend.
- Leaderboard pulls saved user scores from MongoDB.
- If no logged-in user exists, the app still falls back to local browser storage for guest usage.
