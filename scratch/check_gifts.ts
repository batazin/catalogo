import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const gifts = await prisma.gift.findMany({
    where: {
      name: {
        contains: 'Lençol',
        mode: 'insensitive'
      }
    }
  });
  console.log(JSON.stringify(gifts, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
