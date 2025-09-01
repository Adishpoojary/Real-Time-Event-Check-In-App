import type { Context } from './context';

export const resolvers = {
  Query: {
    events: async (_: any, __: any, { prisma }: Context) => {
      return prisma.event.findMany({
        include: { attendees: true },
        orderBy: { startTime: 'asc' },
      });
    },
    me: async (_: any, __: any, { prisma, user }: Context) => {
      if (!user) return null;
      return prisma.user.findUnique({ where: { id: user.id } });
    },
  },
  Mutation: {
    joinEvent: async (_: any, { eventId }: { eventId: string }, { prisma, user, io }: Context) => {
      if (!user) {
        throw new Error('Not authenticated');
      }
      // connect user to event
      await prisma.event.update({
        where: { id: eventId },
        data: { attendees: { connect: { id: user.id } } },
      });

      // read fresh attendees
      const updated = await prisma.event.findUnique({
        where: { id: eventId },
        include: { attendees: true },
      });
      if (!updated) throw new Error('Event not found');

      // emit to room
      io.to(eventId).emit('attendeeUpdate', {
        eventId,
        attendees: updated.attendees.map(a => ({ id: a.id, name: a.name, email: a.email })),
      });

      return updated;
    },
  },
};
