import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import google from 'googlethis';

const prisma = new PrismaClient();
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function downloadImage(url, filepath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
    return false;
  }
}

async function run() {
  const productsDir = path.join(process.cwd(), 'public', 'images', 'products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  const gifts = await prisma.gift.findMany();
  console.log(`Found ${gifts.length} gifts to process.`);

  for (const gift of gifts) {
    console.log(`\nProcessing: ${gift.name}`);
    if (gift.image && gift.image.startsWith('/images/products/')) {
      console.log(`Already has local image: ${gift.image}`);
      continue;
    }

    try {
      const results = await google.image(gift.name, { safe: false });
      if (results && results.length > 0) {
        // Try to find a working URL among the top 3 results
        let downloaded = false;
        let ext = '.jpg';
        let filename = `${gift.id}${ext}`;
        let filepath = path.join(productsDir, filename);

        for (let i = 0; i < Math.min(3, results.length); i++) {
          const imgUrl = results[i].url;
          console.log(`Trying URL ${i+1}: ${imgUrl}`);
          
          if (imgUrl.toLowerCase().endsWith('.png')) {
             ext = '.png';
             filename = `${gift.id}${ext}`;
             filepath = path.join(productsDir, filename);
          } else if (imgUrl.toLowerCase().endsWith('.webp')) {
             ext = '.webp';
             filename = `${gift.id}${ext}`;
             filepath = path.join(productsDir, filename);
          }

          downloaded = await downloadImage(imgUrl, filepath);
          if (downloaded) {
             const stat = fs.statSync(filepath);
             if (stat.size > 2000) { // must be > 2KB to be a real image
                 break;
             } else {
                 downloaded = false; // try next
                 fs.unlinkSync(filepath);
             }
          }
        }

        if (downloaded) {
          const dbPath = `/images/products/${filename}`;
          await prisma.gift.update({
            where: { id: gift.id },
            data: { image: dbPath }
          });
          console.log(`✓ Updated ${gift.name} with ${dbPath}`);
        } else {
          console.log(`✗ Could not download a valid image for ${gift.name}`);
        }
      } else {
        console.log(`✗ No images found for ${gift.name}`);
      }
    } catch (e) {
      console.error(`Status error for ${gift.name}: ${e.message}`);
    }

    // Wait a bit to not get IP banned by google
    await delay(1500);
  }
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Script finished');
  });
