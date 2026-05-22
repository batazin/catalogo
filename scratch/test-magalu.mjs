import fs from 'fs';
import path from 'path';

async function testFetch() {
  const url = 'https://m.magazineluiza.com.br/cafeteira-nescafe-dolce-gusto-mini-me-vermelha-e-preta-automatica-capsulas-220v-arno/p/ff98cc7d9f/ep/cfex/';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const match = html.match(/<meta\\s+property=\"og:image\"\\s+content=\"([^\"]+)\"/i) || html.match(/<img[^>]+src=\"([^\"]+)\"[^>]*data-testid=\"image-product\"/i);
  console.log("Match:", match ? match[1] : 'No image found');
}

testFetch();