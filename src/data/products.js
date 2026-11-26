export const products = [
  {
    id: "ps5",
    name: "PlayStation 5",
    subtitle: "Console Sony com leitor de disco",
    keywords: "ps5 playstation console sony videogame",
    badge: "SOMENTE HOJE",
    averagePrice: 6000,
    tone: "from-indigo-500 to-blue-600",
    icon: "console",
    stores: [
      {
        name: "Mercado Livre",
        price: 4500,
        url: "https://lista.mercadolivre.com.br/playstation-5",
      },
      {
        name: "Amazon",
        price: 4799,
        url: "https://www.amazon.com.br/s?k=PlayStation+5",
      },
      {
        name: "Magalu",
        price: 4899,
        url: "https://www.magazineluiza.com.br/busca/playstation+5/",
      },
    ],
  },
  {
    id: "iphone-15",
    name: "iPhone 15 128GB",
    subtitle: "Apple, tela Super Retina XDR",
    keywords: "iphone apple celular smartphone",
    badge: null,
    averagePrice: 5499,
    tone: "from-slate-700 to-slate-900",
    icon: "phone",
    stores: [
      {
        name: "Mercado Livre",
        price: 4799,
        url: "https://lista.mercadolivre.com.br/iphone-15-128gb",
      },
      {
        name: "Amazon",
        price: 4599,
        url: "https://www.amazon.com.br/s?k=iPhone+15+128GB",
      },
      {
        name: "Magalu",
        price: 4399,
        url: "https://www.magazineluiza.com.br/busca/iphone+15+128gb/",
      },
    ],
  },
  {
    id: "tv-samsung-55",
    name: 'Smart TV Samsung 55" 4K',
    subtitle: "Crystal UHD, Wi-Fi e Bluetooth",
    keywords: "smart tv samsung televisão television 55 4k",
    badge: null,
    averagePrice: 2899,
    tone: "from-sky-500 to-cyan-600",
    icon: "tv",
    stores: [
      {
        name: "Mercado Livre",
        price: 2399,
        url: "https://lista.mercadolivre.com.br/smart-tv-samsung-55-4k",
      },
      {
        name: "Amazon",
        price: 2199,
        url: "https://www.amazon.com.br/s?k=Smart+TV+Samsung+55+4K",
      },
      {
        name: "Magalu",
        price: 2499,
        url: "https://www.magazineluiza.com.br/busca/smart+tv+samsung+55/",
      },
    ],
  },
];

export function formatBRL(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function cheapestStore(product) {
  return product.stores.reduce((best, store) =>
    store.price < best.price ? store : best
  );
}
