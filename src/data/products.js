// Gera imagens demonstrativas limpas até você enviar suas fotos reais na pasta /public/produtos/
function demoSlide(title, subtitle, accent = '#1F4FD8', slideTag = 'Foto 1') {
  const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const safeSub = subtitle.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480">
      <rect width="640" height="480" fill="#F8F9FB"/>
      <circle cx="540" cy="80" r="110" fill="${accent}" fill-opacity="0.08"/>
      <circle cx="100" cy="400" r="130" fill="#FFD400" fill-opacity="0.16"/>
      <rect x="44" y="36" width="110" height="30" rx="15" fill="${accent}" fill-opacity="0.12"/>
      <text x="99" y="56" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="${accent}">${slideTag}</text>
      <rect x="150" y="128" width="340" height="190" rx="22" fill="#FFFFFF" stroke="#E4E7EC" stroke-width="3"/>
      <rect x="176" y="156" width="90" height="12" rx="6" fill="#FFD400"/>
      <text x="320" y="218" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="24" fill="#111111">${safeTitle}</text>
      <text x="320" y="252" text-anchor="middle" font-family="Arial, sans-serif" font-weight="600" font-size="16" fill="#667085">${safeSub}</text>
      <text x="320" y="395" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#98A2B3">GIRAE • Espaço pronto para foto real</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const CATEGORIES = [
  { name: 'Games & Consoles', icon: 'games', description: 'Consoles, controles e jogos' },
  { name: 'Celulares & Tablets', icon: 'mobile', description: 'Smartphones e acessórios' },
  { name: 'Informática & PC', icon: 'pc', description: 'Notebooks, monitores e hardware' },
  { name: 'TVs & Áudio', icon: 'tv', description: 'Smart TVs, soundbars e fones' },
  { name: 'Casa & Cozinha', icon: 'home', description: 'Eletros e utilidades' },
  { name: 'Moda & Calçados', icon: 'fashion', description: 'Roupas, calças e tênis' },
  { name: 'Esporte & Fitness', icon: 'sport', description: 'Treino, corrida e bikes' },
  { name: 'Beleza & Cuidados', icon: 'beauty', description: 'Cabelo, pele e perfumes' },
  { name: 'Automotivo & Motos', icon: 'auto', description: 'Capacetes, pneus e peças' },
  { name: 'Ofertas Relâmpago', icon: 'default', description: 'Quedas bruscas do dia' },
];

export const PRODUCTS = [
  {
    id: 'ps5-slim-disco',
    title: 'PlayStation 5 Slim com Leitor de Disco 1TB',
    category: 'Games & Consoles',
    niches: ['Consoles', 'PlayStation'],
    isOriginal: true,
    featuredWeek: true,
    impactScore: 99,
    createdAt: '2026-11-26',
    images: [
      demoSlide('PlayStation 5 Slim', '1TB SSD • Leitor de Disco', '#1F4FD8', 'Principal'),
      demoSlide('Controle DualSense', 'Resposta tátil inclusa', '#1F4FD8', 'Detalhe 2'),
      demoSlide('Garantia Sony BR', 'Nota fiscal e lacrado', '#0A8F4D', 'Original'),
    ],
    stores: [
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 3499.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 3999.0, url: 'https://www.amazon.com.br' },
      { name: 'KaBuM!', badge: 'KBM', color: '#FF6500', textColor: '#FFFFFF', price: 4149.0, url: 'https://www.kabum.com.br' },
      { name: 'Magalu', badge: 'MGL', color: '#0086FF', textColor: '#FFFFFF', price: 4299.0, url: 'https://www.magazineluiza.com.br' },
      { name: 'Loja Oficial', badge: 'OFC', color: '#111111', textColor: '#FFFFFF', price: 4499.0, url: 'https://www.playstation.com/pt-br/' },
    ],
  },
  {
    id: 'iphone-15-128gb',
    title: 'Apple iPhone 15 128GB 5G Tela 6,1" Preto',
    category: 'Celulares & Tablets',
    niches: ['Smartphones', 'Apple'],
    isOriginal: true,
    featuredWeek: true,
    impactScore: 96,
    createdAt: '2026-11-26',
    images: [
      demoSlide('iPhone 15 128GB', 'Chip A16 Bionic • USB-C', '#111111', 'Principal'),
      demoSlide('Câmera 48MP', 'Fotos em super resolução', '#1F4FD8', 'Detalhe 2'),
      demoSlide('Anatel Brasil', '1 ano de garantia Apple', '#0A8F4D', 'Original'),
    ],
    stores: [
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 4199.0, url: 'https://www.amazon.com.br' },
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 4599.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Magalu', badge: 'MGL', color: '#0086FF', textColor: '#FFFFFF', price: 4749.0, url: 'https://www.magazineluiza.com.br' },
      { name: 'KaBuM!', badge: 'KBM', color: '#FF6500', textColor: '#FFFFFF', price: 4899.0, url: 'https://www.kabum.com.br' },
      { name: 'Loja Oficial', badge: 'OFC', color: '#111111', textColor: '#FFFFFF', price: 5299.0, url: 'https://www.apple.com/br/' },
    ],
  },
  {
    id: 'notebook-gamer-rtx4050',
    title: 'Notebook Gamer Acer Nitro V15 i5 16GB RTX 4050',
    category: 'Informática & PC',
    niches: ['Notebooks', 'Gamer'],
    isOriginal: true,
    featuredWeek: true,
    impactScore: 95,
    createdAt: '2026-11-25',
    images: [
      demoSlide('Acer Nitro V15', 'RTX 4050 • Tela 144Hz', '#E3192B', 'Principal'),
      demoSlide('16GB DDR5 + SSD', 'Pronto para jogos e edição', '#1F4FD8', 'Detalhe 2'),
      demoSlide('Teclado Retroiluminado', 'Padrão ABNT2', '#111111', 'Detalhe 3'),
    ],
    stores: [
      { name: 'KaBuM!', badge: 'KBM', color: '#FF6500', textColor: '#FFFFFF', price: 4499.0, url: 'https://www.kabum.com.br' },
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 4999.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 5190.0, url: 'https://www.amazon.com.br' },
      { name: 'Magalu', badge: 'MGL', color: '#0086FF', textColor: '#FFFFFF', price: 5399.0, url: 'https://www.magazineluiza.com.br' },
      { name: 'Loja Oficial', badge: 'OFC', color: '#111111', textColor: '#FFFFFF', price: 5699.0, url: 'https://br-store.acer.com/' },
    ],
  },
  {
    id: 'smart-tv-oled-55',
    title: 'Smart TV LG OLED 55" 4K 120Hz Gaming HDMI 2.1',
    category: 'TVs & Áudio',
    niches: ['Smart TVs', 'OLED 4K'],
    isOriginal: true,
    featuredWeek: true,
    impactScore: 94,
    createdAt: '2026-11-25',
    images: [
      demoSlide('LG OLED 55" 4K', 'Preto puro • 120Hz', '#1F4FD8', 'Principal'),
      demoSlide('4x HDMI 2.1', 'Ideal para PS5 e PC', '#111111', 'Detalhe 2'),
      demoSlide('Dolby Vision', 'Cinema em casa', '#E3192B', 'Detalhe 3'),
    ],
    stores: [
      { name: 'Magalu', badge: 'MGL', color: '#0086FF', textColor: '#FFFFFF', price: 4799.0, url: 'https://www.magazineluiza.com.br' },
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 5299.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 5499.0, url: 'https://www.amazon.com.br' },
      { name: 'KaBuM!', badge: 'KBM', color: '#FF6500', textColor: '#FFFFFF', price: 5649.0, url: 'https://www.kabum.com.br' },
      { name: 'Loja Oficial', badge: 'OFC', color: '#111111', textColor: '#FFFFFF', price: 5999.0, url: 'https://www.lg.com/br' },
    ],
  },
  {
    id: 'monitor-lg-ultragear-27',
    title: 'Monitor Gamer LG UltraGear 27" IPS 180Hz 1ms',
    category: 'Informática & PC',
    niches: ['Monitores', 'Gamer'],
    isOriginal: true,
    featuredWeek: true,
    impactScore: 91,
    createdAt: '2026-11-24',
    images: [
      demoSlide('LG UltraGear 27"', 'IPS 180Hz • 1ms GtG', '#E3192B', 'Principal'),
      demoSlide('Bordas Ultrafinas', 'Compatível G-Sync / FreeSync', '#1F4FD8', 'Detalhe 2'),
    ],
    stores: [
      { name: 'KaBuM!', badge: 'KBM', color: '#FF6500', textColor: '#FFFFFF', price: 999.0, url: 'https://www.kabum.com.br' },
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 1189.0, url: 'https://www.amazon.com.br' },
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 1249.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Magalu', badge: 'MGL', color: '#0086FF', textColor: '#FFFFFF', price: 1329.0, url: 'https://www.magazineluiza.com.br' },
    ],
  },
  {
    id: 'dualsense-midnight-black',
    title: 'Controle Sem Fio DualSense PS5 Midnight Black',
    category: 'Games & Consoles',
    niches: ['Controles', 'PlayStation'],
    isOriginal: true,
    featuredWeek: true,
    impactScore: 88,
    createdAt: '2026-11-24',
    images: [
      demoSlide('DualSense Black', 'Original Sony • Bluetooth', '#111111', 'Principal'),
      demoSlide('Gatilhos Adaptáveis', 'Compatível PS5 e PC', '#1F4FD8', 'Detalhe 2'),
    ],
    stores: [
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 329.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 389.0, url: 'https://www.amazon.com.br' },
      { name: 'KaBuM!', badge: 'KBM', color: '#FF6500', textColor: '#FFFFFF', price: 419.0, url: 'https://www.kabum.com.br' },
      { name: 'Loja Oficial', badge: 'OFC', color: '#111111', textColor: '#FFFFFF', price: 469.0, url: 'https://www.playstation.com/pt-br/' },
    ],
  },
  {
    id: 'calca-cargo-sarja',
    title: 'Calça Cargo Masculina Sarja Streetwear Preta',
    category: 'Moda & Calçados',
    niches: ['Calças', 'Cargo'],
    isOriginal: false,
    featuredWeek: false,
    impactScore: 80,
    createdAt: '2026-11-23',
    images: [
      demoSlide('Calça Cargo Preta', 'Sarja reforçada • 6 bolsos', '#111111', 'Principal'),
      demoSlide('Modelagem Conforto', 'Tamanhos 38 ao 46', '#1F4FD8', 'Detalhe 2'),
    ],
    stores: [
      { name: 'Shopee', badge: 'SHP', color: '#EE4D2D', textColor: '#FFFFFF', price: 119.9, url: 'https://shopee.com.br' },
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 159.9, url: 'https://www.mercadolivre.com.br' },
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 179.9, url: 'https://www.amazon.com.br' },
    ],
  },
  {
    id: 'tenis-corrida-fila-kr6',
    title: 'Tênis Fila KR6 Performance Corrida Masculino',
    category: 'Esporte & Fitness',
    niches: ['Corrida', 'Tênis'],
    isOriginal: true,
    featuredWeek: false,
    impactScore: 86,
    createdAt: '2026-11-23',
    images: [
      demoSlide('Fila KR6 Corrida', 'Ultraleve • Treino e prova', '#1F4FD8', 'Principal'),
      demoSlide('Solado Ever-Grip', 'Alta tração no asfalto', '#0A8F4D', 'Detalhe 2'),
    ],
    stores: [
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 319.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 399.0, url: 'https://www.amazon.com.br' },
      { name: 'Loja Oficial', badge: 'OFC', color: '#111111', textColor: '#FFFFFF', price: 449.0, url: 'https://www.fila.com.br' },
    ],
  },
  {
    id: 'air-fryer-oven-12l',
    title: 'Fritadeira Air Fryer Oven 12L Digital Inox',
    category: 'Casa & Cozinha',
    niches: ['Eletroportáteis', 'Air Fryer'],
    isOriginal: true,
    featuredWeek: false,
    impactScore: 85,
    createdAt: '2026-11-22',
    images: [
      demoSlide('Air Fryer Oven 12L', 'Painel Touch • 2 bandejas', '#111111', 'Principal'),
      demoSlide('1800W de Potência', 'Assa, frita e desidrata', '#E3192B', 'Detalhe 2'),
    ],
    stores: [
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 489.0, url: 'https://www.amazon.com.br' },
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 579.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Magalu', badge: 'MGL', color: '#0086FF', textColor: '#FFFFFF', price: 619.0, url: 'https://www.magazineluiza.com.br' },
      { name: 'Loja Oficial', badge: 'OFC', color: '#111111', textColor: '#FFFFFF', price: 699.0, url: 'https://www.mondial.com.br' },
    ],
  },
  {
    id: 'capacete-ls2-ff358',
    title: 'Capacete LS2 FF358 Classic Preto Fosco Viseira Cristal',
    category: 'Automotivo & Motos',
    niches: ['Motos', 'Capacetes'],
    isOriginal: true,
    featuredWeek: false,
    impactScore: 84,
    createdAt: '2026-11-22',
    images: [
      demoSlide('Capacete LS2 FF358', 'Selo Inmetro • Forro lavável', '#111111', 'Principal'),
      demoSlide('Viseira 2mm', 'Troca rápida antirrisco', '#1F4FD8', 'Detalhe 2'),
    ],
    stores: [
      { name: 'Mercado Livre', badge: 'ML', color: '#FFE600', textColor: '#111111', price: 479.0, url: 'https://www.mercadolivre.com.br' },
      { name: 'Amazon', badge: 'AMZ', color: '#232F3E', textColor: '#FFFFFF', price: 559.0, url: 'https://www.amazon.com.br' },
      { name: 'Shopee', badge: 'SHP', color: '#EE4D2D', textColor: '#FFFFFF', price: 589.0, url: 'https://shopee.com.br' },
      { name: 'Loja Oficial', badge: 'OFC', color: '#111111', textColor: '#FFFFFF', price: 649.0, url: 'https://www.ls2.com.br' },
    ],
  },
];

export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getSortedStores(product) {
  return [...product.stores].sort((a, b) => a.price - b.price).slice(0, 5);
}

export function getMaxSavings(product) {
  const stores = getSortedStores(product);
  if (stores.length < 2) return 0;
  return stores[stores.length - 1].price - stores[0].price;
}