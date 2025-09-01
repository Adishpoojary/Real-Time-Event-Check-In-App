import type { PrismaClient } from '@prisma/client';
import type { AuthUser } from './types';

export type Context = {
  prisma: PrismaClient;
  user: AuthUser;
  io: import('socket.io').Server;
};
