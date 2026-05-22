import fs from 'fs';
import path from 'path';

async function ddgImageSearch(query) {
  try {
    // DuckDuckGo Lite search first to get vqd
    const res = await fetch(`https://duckduckgo.com/lite/?q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const html = await res.text();
    // Lite version has no images, but wait, maybe duckduckgo duckduckgo image search api is not possible without vqd
    
    // Instead of DDG, maybe we can search Yahoo?
    const yQuery = encodeURIComponent(query);
    const yRes = await fetch(`https://images.search.yahoo.com/search/images?p=${yQuery}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const yHtml = await yRes.text();
    const imgs = [...yHtml.matchAll(/<img[^>]+src='([^']+)'/g)];
    if (imgs && imgs.length > 0) {
       for (const m of imgs) {
         if (m[1].includes('http')) return m[1];
       }
    }
    return null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function test() {
  const url = await ddgImageSearch('Cafeteira Nescafe Dolce Gusto Mini Me');
  console.log('Found:', url);
}

test();