import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const placeholderImages = {
  'Cafeteira': 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format',
  'Jogo de Jantar': 'https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format',
  'Sala de Jantar': 'https://images.unsplash.com/photo-1617806118233-18e1c12e846f?auto=format',
  'Sofá': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format',
  'Fogão': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format',
  'Máquina de Lavar': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format',
  'Faqueiro': 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format',
  'Aspirador': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format',
  'Fritadeira': 'https://images.unsplash.com/photo-1599813580556-9ddf4dff4b13?auto=format',
  'Secadora': 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format',
  'Micro-ondas': 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format',
  'Panela de Arroz': 'https://plus.unsplash.com/premium_photo-1678280031535-64bb66bd6e19?auto=format',
  'Ventilador': 'https://images.unsplash.com/photo-1565515267448-43d8bcca3436?auto=format',
  'Escorredor': 'https://images.unsplash.com/photo-1581622558667-3419a8dc5f83?auto=format',
  'Torradeira': 'https://images.unsplash.com/photo-1594519946401-443b7470656a?auto=format',
  'Espremedor': 'https://plus.unsplash.com/premium_photo-1664115865203-7cb70c1dbfa2?auto=format',
  'Jogo de Lençol': 'https://images.unsplash.com/photo-1522771730849-ce2058816c7e?auto=format',
  'Jogo Jantar': 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format',
  'Cobertor': 'https://images.unsplash.com/photo-1584988636774-8b6b0d911b33?auto=format',
  'Toalha': 'https://images.unsplash.com/photo-1583332029513-4318c5e93361?auto=format',
  'Mixer': 'https://images.unsplash.com/photo-1585287413533-3d0b2e88a38c?auto=format',
  'Batedeira': 'https://images.unsplash.com/photo-1563212040-cb5ca0e3bf73?auto=format',
};

async function fixImages() {
  const gifts = await prisma.gift.findMany();
  let count = 0;

  for (const gift of gifts) {
    let newImage = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format'; // fallback caixa de presente
    
    // Procura uma imagem baseada na palavra-chave
    for (const [key, url] of Object.entries(placeholderImages)) {
      if (gift.name.toLowerCase().includes(key.toLowerCase())) {
        newImage = url;
        break;
      }
    }

    try {
      await prisma.gift.update({
        where: { id: gift.id },
        data: { image: newImage }
      });
      console.log(`Atualizada imagem para: ${gift.name}`);
      count++;
    } catch (e) {
      console.error(`Erro ao atualizar: ${gift.name}`);
    }
  }

  console.log(`Processo finalizado. ${count} imagens atualizadas!`);
}

fixImages().finally(() => prisma.$disconnect());