import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.user.upsert({ where: { id: 'test-user-1' }, update: {}, create: { id: 'test-user-1' } }),
    prisma.user.upsert({ where: { id: 'test-user-2' }, update: {}, create: { id: 'test-user-2' } }),
    prisma.user.upsert({ where: { id: 'test-user-3' }, update: {}, create: { id: 'test-user-3' } }),
  ]);

  console.log('Multi-seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 