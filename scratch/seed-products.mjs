import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    name: 'Cafeteira Nescafe Dolce Gusto Mini Me Vermelha e Preta',
    description: 'Cafeteira Automática Cápsulas 220v Arno. Moderna e compacta para o seu café diário.',
    price: 389.90,
    image: 'https://a-static.mlcdn.com.br/800x600/cafeteira-nescafe-dolce-gusto-mini-me-vermelha-e-preta-automatica-capsulas-220v-arno/magazineluiza/ff98cc7d9f/2/3a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Jogo de Jantar Ryo Maresia Para 6 Pessoas Oxford',
    description: 'Aparelho de jantar em porcelana inspirado no mar, com 24 peças de alta qualidade.',
    price: 519.27,
    image: 'https://a-static.mlcdn.com.br/800x600/jogo-de-jantar-ryo-maresia-para-6-pessoas-oxford/magazineluiza/cdd081d4da/2/7c5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Conjunto Sala de Jantar Tampo de Vidro 4 Cadeiras Braga Madesa',
    description: 'Mesa elegante com tampo de vidro e cadeiras confortáveis para sua sala de jantar.',
    price: 899.00,
    image: 'https://a-static.mlcdn.com.br/800x600/conjunto-sala-de-jantar-tampo-de-vidro-4-cadeiras-braga-madesa/magazineluiza/ek71j0c6e7/2/1a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Sofá Retrátil e Reclinável 3 lugares 1,90m Stella Suede Cinza',
    description: 'Sofá confortável com molas, ideal para descansar e assistir TV.',
    price: 1299.00,
    image: 'https://a-static.mlcdn.com.br/800x600/sofa-retratil-e-reclinavel-3-lugares-190m-com-molas-stella-suede-cinza-adonai-estofados/magazineluiza/jd4cfb7299/2/4a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Fogão de Piso 5 Bocas CFS5VAR Consul',
    description: 'Fogão com acendimento automático e acabamento em inox Easy Clean.',
    price: 1624.68,
    image: 'https://a-static.mlcdn.com.br/800x600/fogao-de-piso-5-bocas-cfs5var-com-acendimento-automatico-consul/magazineluiza/hk7ac55gde/2/5a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Máquina de Lavar Electrolux 15kg Branca LED15',
    description: 'Máquina de lavar com sistema Jet&Clean e cesto inox de grande capacidade.',
    price: 1899.00,
    image: 'https://a-static.mlcdn.com.br/800x600/maquina-de-lavar-electrolux-15kg-branca-essential-care-com-cesto-inox-e-jet-clean-led15/magazineluiza/kee9b751fb/2/6a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Faqueiro de Luxo Inox 42 Peças com Caixa de Madeira',
    description: 'Conjunto completo de talheres em inox de alta durabilidade e elegância.',
    price: 150.00,
    image: 'https://a-static.mlcdn.com.br/800x600/faqueiro-de-luxo-inox-24-42-pecas-com-caixa-de-madeira-conjunto-completo-de-talheres-alta-durabilidade-presente-casamento-faqueiro-completo-casitaa/magazineluiza/fge0ca3c51/2/7a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Aspirador de pó profissional 10l 1000w APV1010 Vonder',
    description: 'Aspirador potente e versátil para limpeza profissional e doméstica.',
    price: 450.00,
    image: 'https://a-static.mlcdn.com.br/800x600/aspirador-de-po-profissional-10l-1000w-apv1010-vonder-220v/magazineluiza/gda2kga8k6/2/8a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Fritadeira Oven Fryer 12L Oster Multi Touch 3 em 1',
    description: 'Fritadeira sem óleo de grande capacidade com funções de forno e desidratador.',
    price: 799.00,
    image: 'https://a-static.mlcdn.com.br/800x600/fritadeira-oven-fryer-12l-oster-multi-touch-3-em-1/magazineluiza/abb23dfj0j/2/9a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Secadora de Roupas Electrolux Piso e Parede',
    description: 'Secadora eficiente e compacta, pode ser instalada no piso ou na parede.',
    price: 1599.00,
    image: 'https://a-static.mlcdn.com.br/800x600/secadora-de-roupas-de-piso-e-parede-electrolux/magazineluiza/238148600/2/0a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Micro-ondas Philco 28L Prata Espelhado PMO30S',
    description: 'Micro-ondas potente com design espelhado e 28 litros de capacidade.',
    price: 699.00,
    image: 'https://a-static.mlcdn.com.br/800x600/micro-ondas-philco-28l-prata-espelhado-pmo30s/magazineluiza/240969700/2/1a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Panela de Arroz Elétrica 5 Xícaras Philco PH5P',
    description: 'Praticidade para o seu dia a dia com a panela de arroz automática Philco.',
    price: 180.00,
    image: 'https://a-static.mlcdn.com.br/800x600/panela-de-arroz-eletrica-5-xicaras-philco-ph5p/magazineluiza/238194000/2/2a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Ventilador de Coluna Mondial Super Turbo 50cm',
    description: 'Ventilador potente com 8 pás e 3 velocidades para refrescar qualquer ambiente.',
    price: 250.00,
    image: 'https://a-static.mlcdn.com.br/800x600/ventilador-de-coluna-mondial-super-turbo-vtx-50c-8p-50cm-3-velocidades/magazineluiza/227649400/2/3a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Escorredor Louça 2 Andares Aço Completo',
    description: 'Organização e praticidade para sua pia com este escorredor de 2 andares.',
    price: 120.00,
    image: 'https://a-static.mlcdn.com.br/800x600/escorredor-louca-2-andares-aco-pratos-talheres-copos-secador-duplo-para-pia-e-bancada-de-cozinha-monae/magazineluiza/adfbdhgkkf/2/4a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Torradeira Elétrica Electrolux ETS10 Efficient',
    description: 'Torradeira com níveis de tostagem e design moderno para seu café da manhã.',
    price: 220.00,
    image: 'https://a-static.mlcdn.com.br/800x600/torradeira-tostadeira-eletrica-electrolux-ets10-efficient-800w-220v-240v-grafite/magazineluiza/fhbc4d29bg/2/5a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Espremedor de Laranja Elétrico Juicer USB',
    description: 'Espremedor portátil e recarregável via USB, prático para qualquer lugar.',
    price: 150.00,
    image: 'https://a-static.mlcdn.com.br/800x600/espremedor-de-laranja-eletrico-maquina-de-suco-de-frutas-juicer-carregamento-usb-juice-cytrus/magazineluiza/jhc6693j6b/2/6a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Jogo de Lençol 400 Fios Algodão Percal Egípcio',
    description: 'Conforto e luxo para suas noites com o jogo de lençol de alta qualidade.',
    price: 250.00,
    image: 'https://a-static.mlcdn.com.br/800x600/jogo-de-lencol-cama-casal-queen-e-king4-pecas-supreme-400-fios-100-algodao-percal-egipcio-vr-enxovais/magazineluiza/bk7had0e0b/2/7a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Aparelho Jogo Jantar Louça Quartier White 20 Peças',
    description: 'Design quadrado e moderno em porcelana branca Oxford.',
    price: 450.00,
    image: 'https://a-static.mlcdn.com.br/800x600/aparelho-jogo-jantar-louca-quartier-white-20-pecas-oxford/magazineluiza/ecakcdfj9k/2/8a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Cobertor Jolitex Casal Antialergico Kyor Plus',
    description: 'Cobertor macio, quente e antialérgico para o máximo conforto.',
    price: 180.00,
    image: 'https://a-static.mlcdn.com.br/800x600/cobertor-jolitex-casal-antialergico-kyor-plus-escolha-estampa/magazineluiza/hgg6h818ea/2/9a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Jogo de Toalha Banhão Buddemeyer Olimpo 4pçs',
    description: 'Toalhas gigantes e extra macias em 100% algodão.',
    price: 220.00,
    image: 'https://a-static.mlcdn.com.br/800x600/jogo-de-toalha-banhao-buddemeyer-olimpo-extra-soft-gigante-algodao-4pcs/magazineluiza/ek51a91hh0/2/0a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Mixer Britânia 3 em 1 Preto 400W BMX400P',
    description: 'Versatilidade na cozinha: mixer, batedor e triturador em um só aparelho.',
    price: 160.00,
    image: 'https://a-static.mlcdn.com.br/800x600/mixer-britania-3-em-1-preto-400w-bmx400p-2-velocidades/magazineluiza/021557600/2/1a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  },
  {
    name: 'Batedeira Planetária Arno Super Chef KM01 5L',
    description: 'Potência e precisão para suas receitas com a batedeira Arno.',
    price: 480.00,
    image: 'https://a-static.mlcdn.com.br/800x600/batedeira-planetaria-arno-super-chef-km01-5l-preto-220v/magazineluiza/eeea4c74dc/2/2a5f4f8f4e2f8e4e8f4e8f4e8f4e8f4e.jpg'
  }
];

async function main() {
  console.log('Iniciando o cadastro dos produtos...');
  for (const product of products) {
    try {
      await prisma.gift.create({
        data: {
          ...product,
          status: 'AVAILABLE'
        }
      });
      console.log(`Produto adicionado: ${product.name}`);
    } catch (error) {
      console.error(`Erro ao adicionar ${product.name}:`, error);
    }
  }
  console.log('Finalizado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
