import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    id: "cmpczbzj10006umg4ww3pcc9u", // Faqueiro
    url: "https://images.tcdn.com.br/img/img_prod/361962/faqueiro_malibu_42_pecas_em_aco_inox_tramontina_23799_039_1700_1_759102a68f10ba7d90142170b7cccce2_20260309165117.jpg",
    ext: ".jpg"
  },
  {
    id: "cmpczbz8l0004umg4g51bbelj", // Fogão
    url: "https://consul.vtexassets.com/assets/vtex.file-manager-graphql/images/44f78d8a-03c7-4c65-af48-01a4991ef27a___e1cdd75f8d6797d99d6dc8ee4122006f.png",
    ext: ".png"
  },
  {
    id: "cmpczbysv0001umg4tifvp118", // Jogo de Jantar
    url: "https://imgs.extra.com.br/1582395798/1xg.jpg",
    ext: ".jpg"
  },
  {
    id: "cmpczbyig0000umg426hmmmdl", // Cafeteira
    url: "https://a-static.mlcdn.com.br/800x600/kit-cafeteira-dolce-gusto-mini-me-vermelha-e-preta-30-capsulas-nescafe-dolce-gusto/nescafedolcegustooficial/kit-minime-vermelha-220v/46e35da7234983a686d5ce978834db34.jpeg",
    ext: ".jpg"
  }
];

async function updateSpecificImages() {
  const productsDir = path.join(process.cwd(), 'public', 'images', 'products');

  for (const item of updates) {
    console.log(`Downloading for ${item.id}...`);
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = `${item.id}_fixed${item.ext}`;
      const filepath = path.join(productsDir, filename);

      fs.writeFileSync(filepath, buffer);
      
      const dbPath = `/images/products/${filename}`;
      await prisma.gift.update({
        where: { id: item.id },
        data: { image: dbPath }
      });
      console.log(`Updated ${item.id} -> ${dbPath}`);
    } catch (e) {
      console.error(`Failed ${item.id}:`, e);
    }
  }
}

updateSpecificImages().then(() => {
  console.log("Done");
  process.exit(0);
});
