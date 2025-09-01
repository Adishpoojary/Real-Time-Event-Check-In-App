import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Upsert two users whose ids match our mock tokens
  await prisma.user.upsert({
    where: { id: 'user1' },
    update: {},
    create: { id: 'user1', name: 'Alice Johnson', email: 'alice@example.com' },
  });
  await prisma.user.upsert({
    where: { id: 'user2' },
    update: {},
    create: { id: 'user2', name: 'Bob Singh', email: 'bob@example.com' },
  });

  // Some sample events
  const now = new Date();
  const events = [
    { name: 'Tech Meetup', location: 'Auditorium A', startTime: new Date(now.getTime() + 3600_000) },
    { name: 'Open Mic Night', location: 'Cafeteria', startTime: new Date(now.getTime() + 7200_000) },
    { name: 'College Fest', location: 'Main Ground', startTime: new Date(now.getTime() + 10800_000) },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }

  console.log('Seeded users and events.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
