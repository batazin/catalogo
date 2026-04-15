import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updatedGift = await prisma.gift.update({
    where: {
      id: 'cmnyt80vz000gum8oh8cwdalj'
    },
    data: {
      image: 'https://a-static.mlcdn.com.br/1200x800/jogo-de-lencol-casal-percal-400-fios-100-algodao-egipcio-3-pcs-casa-di-valle/b2fcomercio/15fe0a6a0eac11ed92314201ac185079/e109a513f7331e232596dce0e10c6ac8.jpeg'
    }
  });
  console.log('Successfully updated gift image:', updatedGift.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
