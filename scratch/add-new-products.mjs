import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const newProducts = [
  {
    name: 'JBL Soundbar SB180, 2.1 Canais, 6.5" Wireless Subwoofer',
    description: 'Soundbar de 110W RMS com subwoofer sem fios para graves profundos, conexão HDMI ARC e Bluetooth.',
    price: 929.00,
    image: 'https://m.media-amazon.com/images/I/51rDbX0su5L._AC_SY450_.jpg'
  },
  {
    name: 'Mesa de Jantar Quadrada 4 Lugares Celebrare',
    description: 'Mesa de jantar moderna com dimensões 90x90cm, acabamento em Amêndoa Clean/Off White. (Apenas a mesa)',
    price: 399.98,
    image: 'https://m.media-amazon.com/images/I/710ht1IiM5L._AC_SY450_.jpg'
  },
  {
    name: 'Cabeceira Box Casal com 2 Mesas de Cabeceira com Led Innova',
    description: 'Cabeceira extensível com iluminação LED embutida, acompanha duas mesas de cabeceira com gavetas telescópicas.',
    price: 984.38,
    image: 'https://m.media-amazon.com/images/I/71oXKHRxidL._AC_SY450_.jpg'
  }
];

async function main() {
  console.log('Iniciando o cadastro dos novos produtos...');

  for (const product of newProducts) {
    const gift = await prisma.gift.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        status: 'AVAILABLE'
      }
    });
    console.log(`Produto adicionado: ${gift.name} (ID: ${gift.id})`);
  }

  console.log('Finalizado com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
