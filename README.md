# Real-Time Event Check-In App  

A minimal full-stack application for **real-time attendee check-ins** during events.  
This project demonstrates backend–frontend integration with WebSockets for live updates.  

---

## 🚀 Tech Stack  

**Backend**  
- Node.js, TypeScript  
- GraphQL (Apollo Server)  
- Prisma ORM (PostgreSQL)  
- Socket.io  

**Frontend**  
- React Native (Expo)  
- TypeScript  
- Zustand (state management)  
- TanStack Query  
- GraphQL Request  
- socket.io-client  

---

## 📂 Monorepo Structure  


---

## ⚙️ Requirements  

- **Node.js** v18+ → [Download](https://nodejs.org)  
- **pnpm** (recommended) → `npm i -g pnpm`  
- **PostgreSQL** 14+ → [Download](https://www.postgresql.org/download/)  
- **Expo CLI** → `npm i -g expo` (or use `npx expo`)  

---

## 🗄️ Database Setup  

1. Create a Postgres database (e.g. `realtime_events`).  
2. Copy the connection string:  

```env
postgresql://<USER>:<PASSWORD>@localhost:5432/realtime_events?schema=public









⚙️ Working Process

User Opens App → The frontend (React Native) connects to the backend using GraphQL and WebSockets.

Attendee Check-In → When a user checks in, the app sends the request to the backend.

Backend Processing →

Prisma saves the check-in data to PostgreSQL.

Socket.io broadcasts the new check-in to all connected clients.

Real-Time Updates → Other attendees instantly see the updated attendee list without refreshing.

Query Data → The app can also fetch past check-ins and event details via GraphQL queries.
