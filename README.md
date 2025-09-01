# Real-Time Event Check-In App (Full Stack Assignment)

A minimal, clean reference implementation of the assignment:

- **Backend:** Node.js, TypeScript, GraphQL (Apollo Server), Prisma (PostgreSQL), Socket.io
- **Frontend:** React Native (Expo), TypeScript, Zustand, TanStack Query, socket.io-client, graphql-request

> Focused on clarity, type-safety, and real-time attendee updates.

---

## Monorepo Structure

```
realtime-event-checkin/
  backend/
  frontend/
```

---

## Requirements to Download & Run

### Install Global Prereqs

- **Node.js** v18+ (https://nodejs.org)
- **pnpm** (recommended) OR npm/yarn  
  Install pnpm: `npm i -g pnpm`
- **PostgreSQL** 14+ (https://www.postgresql.org/download/)
- **Expo CLI**: `npm i -g expo` (optional; the local `npx expo` also works)

### Prepare a Postgres database

Create a database (e.g. `realtime_events`), and note the connection URL:
```
postgresql://<USER>:<PASSWORD>@localhost:5432/realtime_events?schema=public
```

---

## Backend Setup (http://localhost:4000)

```
cd backend
cp .env.example .env
# edit .env and set DATABASE_URL + JWT_SECRET

# install deps
pnpm install

# generate prisma client and create tables
pnpm prisma:generate
pnpm prisma:migrate

# seed sample users & events
pnpm prisma:seed

# start dev server
pnpm dev
```
- GraphQL endpoint: `http://localhost:4000/graphql`
- Socket.io endpoint: `http://localhost:4000`
- Mock auth: pass `Authorization: Bearer <token>` header. See example tokens in `.env.example` and below.

**Example tokens**
- `user1` → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user1.signature`
- `user2` → `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user2.signature`
> Any token that ends with `.user1.signature` or `.user2.signature` works (the server only parses the middle part).

---

## Frontend Setup (Expo)

```
cd frontend
cp .env.example .env
# edit if your backend host/port differs

pnpm install
pnpm start
```
When prompted, choose to run in an emulator/simulator or scan the QR code (Expo Go).

**Testing Flow**
1. Open the app → login with one of the example tokens above (paste the token string).
2. Open Event List → tap an event.
3. Press **Join**.
4. Open a second device/emulator (or browser via Expo Web) and log in as the other user.
5. Navigate to the same event; you should see the attendee list update **instantly**.

---

## GraphQL Contract

```graphql
type Query {
  events: [Event!]!
  me: User
}

type Mutation {
  joinEvent(eventId: ID!): Event!
}

type User {
  id: ID!
  name: String!
  email: String!
}

type Event {
  id: ID!
  name: String!
  location: String!
  startTime: String!
  attendees: [User!]!
}
```

---

## Notes on Real-Time

- Each event has a Socket.io room with id equal to the event id.
- When a user opens the Event Detail page, the client emits `joinEventRoom` with `{ eventId }`.
- When someone runs `joinEvent`, the server:
  1. Adds the user to the event via Prisma.
  2. Emits `attendeeUpdate` to that event room with the latest attendee list.

---

## Submission

- Push this repo to GitHub.
- Ensure `README.md` is clear.
- Email link to `teamdetrator@gmail.com` with subject **FullStack Assignment**.

Good luck!
