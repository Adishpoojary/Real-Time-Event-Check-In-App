import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Server as IOServer } from 'socket.io';
import type { Context } from './context';
import type { AuthUser } from './types';

const PORT = Number(process.env.PORT || 4000);
const prisma = new PrismaClient();

const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const io = new IOServer(httpServer, {
  cors: { origin: '*' }
});

// Socket.io rooms: clients emit 'joinEventRoom' to join the event room
io.on('connection', (socket) => {
  socket.on('joinEventRoom', ({ eventId }) => {
    if (eventId) socket.join(eventId);
  });
});

function getUserFromAuthHeader(auth?: string): AuthUser {
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  const token = parts[1];
  try {
    // For mock auth, we accept tokens like header.user1.signature
    const middle = token.split('.')[1];
    if (!middle) return null;
    // treat middle as user handle
    if (middle === 'user1') return { id: 'user1' };
    if (middle === 'user2') return { id: 'user2' };
    // try real JWT if provided
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as any;
    if (decoded?.sub) return { id: decoded.sub };
    if (decoded?.id) return { id: decoded.id };
    return null;
  } catch {
    return null;
  }
}

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const auth = req.headers['authorization'];
    const user = getUserFromAuthHeader(typeof auth === 'string' ? auth : undefined);
    return { prisma, user, io };
  },
});

async function start() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  httpServer.listen(PORT, () => {
    console.log(`GraphQL ready at http://localhost:${PORT}/graphql`);
    console.log(`Socket.io ready at http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
