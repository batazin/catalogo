import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const mapping = JSON.parse(fs.readFileSync('scratch/mapping.json', 'utf8'));

async function revertImages() {
  const gifts = await prisma.gift.findMany();
  let count = 0;

  for (const gift of gifts) {
    const original = mapping.find(m => m.name === gift.name);
    if (original) {
      await prisma.gift.update({
        where: { id: gift.id },
        data: { image: original.image }
      });
      count++;
    }
  }

  console.log(`Revertidas ${count} imagens originais!`);
}

revertImages().finally(() => prisma.$disconnect());