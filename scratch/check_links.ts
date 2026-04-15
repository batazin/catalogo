import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  const gifts = await prisma.gift.findMany();
  console.log(`Checking ${gifts.length} gifts...`);
  
  for (const gift of gifts) {
    if (!gift.image) {
      console.log(`[EMPTY] ${gift.name}`);
      continue;
    }
    
    try {
      const response = await axios.head(gift.image, { timeout: 5000 });
      if (response.status !== 200) {
        console.log(`[FAILED] ${gift.name} - Status: ${response.status} - URL: ${gift.image}`);
      } else {
        console.log(`[OK] ${gift.name}`);
      }
    } catch (error: any) {
      console.log(`[ERROR] ${gift.name} - ${error.message} - URL: ${gift.image}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
