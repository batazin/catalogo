import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mapping = [
  { name: 'Cafeteira Nescafe Dolce Gusto Mini Me Vermelha e Preta', url: 'https://m.magazineluiza.com.br/cafeteira-nescafe-dolce-gusto-mini-me-vermelha-e-preta-automatica-capsulas-220v-arno/p/ff98cc7d9f/ep/cfex/' },
  { name: 'Jogo de Jantar Ryo Maresia Para 6 Pessoas Oxford', url: 'https://m.magazineluiza.com.br/jogo-de-jantar-ryo-maresia-para-6-pessoas-oxford/p/cdd081d4da/ud/apja/' },
  { name: 'Conjunto Sala de Jantar Tampo de Vidro 4 Cadeiras Braga Madesa', url: 'https://m.magazineluiza.com.br/conjunto-sala-de-jantar-tampo-de-vidro-4-cadeiras-braga-madesa/p/ek71j0c6e7/mo/momj/' },
  { name: 'Sofá Retrátil e Reclinável 3 lugares 1,90m Stella Suede Cinza', url: 'https://m.magazineluiza.com.br/sofa-retratil-e-reclinavel-3-lugares-190m-com-molas-stella-suede-cinza-adonai-estofados/p/jd4cfb7299/mo/esto/' },
  { name: 'Fogão de Piso 5 Bocas CFS5VAR Consul', url: 'https://m.magazineluiza.com.br/fogao-de-piso-5-bocas-cfs5var-com-acendimento-automatico-consul/p/hk7ac55gde/ed/fg4b/' },
  { name: 'Máquina de Lavar Electrolux 15kg Branca LED15', url: 'https://m.magazineluiza.com.br/maquina-de-lavar-electrolux-15kg-branca-essential-care-com-cesto-inox-e-jet-clean-led15/p/kee9b751fb/ed/lava/' },
  { name: 'Faqueiro de Luxo Inox 42 Peças com Caixa de Madeira', url: 'https://m.magazineluiza.com.br/faqueiro-de-luxo-inox-24-42-pecas-com-caixa-de-madeira-conjunto-completo-de-talheres-alta-durabilidade-presente-casamento-faqueiro-completo-casitaa/p/fge0ca3c51/ud/faqu/' },
  { name: 'Aspirador de pó profissional 10l 1000w APV1010 Vonder', url: 'https://m.magazineluiza.com.br/aspirador-de-po-profissional-10l-1000w-apv1010-vonder-220v/p/gda2kga8k6/ep/elap/' },
  { name: 'Fritadeira Oven Fryer 12L Oster Multi Touch 3 em 1', url: 'https://m.magazineluiza.com.br/fritadeira-oven-fryer-12l-oster-multi-touch-3-em-1/p/abb23dfj0j/ep/efso/' },
  { name: 'Secadora de Roupas Electrolux Piso e Parede', url: 'https://m.magazineluiza.com.br/secadora-de-ropas-de-piso-e-parede-electrolux/p/238148600/ed/selt/' },
  { name: 'Micro-ondas Philco 28L Prata Espelhado PMO30S', url: 'https://m.magazineluiza.com.br/micro-ondas-philco-28l-prata-espelhado-pmo30s/p/240969700/ed/mond/' },
  { name: 'Panela de Arroz Elétrica 5 Xícaras Philco PH5P', url: 'https://m.magazineluiza.com.br/panela-de-arroz-eletrica-5-xicaras-philco-ph5p/p/238194000/ep/pael/' },
  { name: 'Ventilador de Coluna Mondial Super Turbo 50cm', url: 'https://m.magazineluiza.com.br/ventilador-de-coluna-mondial-super-turbo-vtx-50c-8p-50cm-3-velocidades/p/227649400/ar/arvl/' },
  { name: 'Escorredor Louça 2 Andares Aço Completo', url: 'https://m.magazineluiza.com.br/escorredor-louca-2-andares-aco-pratos-talheres-copos-secador-duplo-para-pia-e-bancada-de-cozinha-monae/p/adfbdhgkkf/ud/espt/' },
  { name: 'Torradeira Elétrica Electrolux ETS10 Efficient', url: 'https://m.magazineluiza.com.br/torradeira-tostadeira-eletrica-electrolux-ets10-efficient-800w-220v-240v-grafite/p/fhbc4d29bg/ep/tost/' },
  { name: 'Espremedor de Laranja Elétrico Juicer USB', url: 'https://m.magazineluiza.com.br/espremedor-de-laranja-eletrico-maquina-de-suco-de-frutas-juicer-carregamento-usb-juice-cytrus/p/jhc6693j6b/ep/espe/' },
  { name: 'Jogo de Lençol 400 Fios Algodão Percal Egípcio', url: 'https://m.magazineluiza.com.br/jogo-de-lencol-cama-casal-queen-e-king4-pecas-supreme-400-fios-100-algodao-percal-egipcio-vr-enxovais/p/bk7had0e0b/cm/cjct/' },
  { name: 'Aparelho Jogo Jantar Louça Quartier White 20 Peças', url: 'https://m.magazineluiza.com.br/aparelho-jogo-jantar-louca-quartier-white-20-pecas-oxford/p/ecakcdfj9k/ud/apja/' },
  { name: 'Cobertor Jolitex Casal Antialergico Kyor Plus', url: 'https://m.magazineluiza.com.br/cobertor-jolitex-casal-antialergico-kyor-plus-escolha-estampa/p/hgg6h818ea/cm/cobt/' },
  { name: 'Jogo de Toalha Banhão Buddemeyer Olimpo 4pçs', url: 'https://m.magazineluiza.com.br/jogo-de-toalha-banhao-buddemeyer-olimpo-extra-soft-gigante-algodao-4pcs/p/ek51a91hh0/cm/joto/' },
  { name: 'Mixer Britânia 3 em 1 Preto 400W BMX400P', url: 'https://m.magazineluiza.com.br/mixer-britania-3-em-1-preto-400w-bmx400p-2-velocidades/p/021557600/ep/mixr/' },
  { name: 'Batedeira Planetária Arno Super Chef KM01 5L', url: 'https://m.magazineluiza.com.br/batedeira-planetaria-arno-super-chef-km01-5l-preto-220v/p/eeea4c74dc/ep/bapl/' }
];

async function updateImages() {
  const gifts = await prisma.gift.findMany();
  
  for (const gift of gifts) {
    const item = mapping.find(m => gift.name.includes(m.name.substring(0, 20)));
    if (item) {
      console.log(`Buscando imagem para: ${gift.name}`);
      try {
        const response = await fetch(item.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        const text = await response.text();
        const match = text.match(/<meta property="og:image" content="(.*?)"/);
        
        if (match && match[1]) {
          const imageUrl = match[1];
          await prisma.gift.update({
            where: { id: gift.id },
            data: { image: imageUrl }
          });
          console.log(`✓ Atualizado: ${imageUrl}`);
        } else {
          console.log(`✗ Não encontrou og:image para ${gift.name}`);
        }
      } catch (error) {
        console.error(`Error fetching ${item.url}:`, error.message);
      }
    }
  }
}

updateImages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
