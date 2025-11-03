import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample events
  const event1 = await prisma.event.create({
    data: {
      name: 'Tech Conference 2025',
      location: 'Convention Center',
      startTime: new Date('2025-12-01T10:00:00Z'),
      endTime: new Date('2025-12-01T18:00:00Z'),
      maxCapacity: 100,
      currentAttendees: 0,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Workshop: Modern Web Development',
      location: 'Online',
      startTime: new Date('2025-11-15T14:00:00Z'),
      endTime: new Date('2025-11-15T17:00:00Z'),
      maxCapacity: 50,
      currentAttendees: 0,
    },
  });

  // Create sample attendees
  await prisma.attendee.create({
    data: {
      eventId: event1.id,
      name: 'John Doe',
      email: 'john@example.com',
      registeredAt: new Date(),
    },
  });

  await prisma.attendee.create({
    data: {
      eventId: event1.id,
      name: 'Jane Smith',
      email: 'jane@example.com',
      registeredAt: new Date(),
    },
  });

  // Update event capacity
  await prisma.event.update({
    where: { id: event1.id },
    data: { currentAttendees: 2 },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📅 Created ${await prisma.event.count()} events`);
  console.log(`👥 Created ${await prisma.attendee.count()} attendees`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });