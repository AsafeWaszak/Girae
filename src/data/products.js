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

export const PRODUCTS = [];

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