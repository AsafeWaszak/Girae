export const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQxPEOrxHAskPBtJKHgbxwOdiNhgVGpTUxSKHG2LwJGI69VpepK0LojLX4p_Qj42UPGbTQ7yXq85ABE/pub?output=csv';

// Troque para false quando quiser esconder os produtos de demonstração e deixar só os da planilha
export const KEEP_DEMO_PRODUCTS = true;

// Lê automaticamente todas as imagens dentro de src/assets/produtos/<pasta>/
const LOCAL_IMAGES = import.meta.glob(
  '../assets/produtos/**/*.{png,jpg,jpeg,webp,avif,PNG,JPG,JPEG,WEBP}',
  { eager: true, import: 'default' }
);

function normalizeSlug(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeHeader(str = '') {
  return String(str)
    .replace(/^\uFEFF/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function buildImageIndex() {
  const index = {};

  Object.entries(LOCAL_IMAGES).forEach(([fullPath, assetUrl]) => {
    const marker = '/assets/produtos/';
    const pos = fullPath.indexOf(marker);
    if (pos === -1) return;

    const relative = fullPath.slice(pos + marker.length);
    const parts = relative.split('/');
    if (parts.length < 2) return;

    const folderKey = normalizeSlug(parts[0]);
    const fileName = parts[parts.length - 1];

    if (!index[folderKey]) index[folderKey] = [];
    index[folderKey].push({ fileName, url: assetUrl });
  });

  Object.keys(index).forEach((key) => {
    index[key].sort((a, b) =>
      a.fileName.localeCompare(b.fileName, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );
  });

  return index;
}

const IMAGE_INDEX = buildImageIndex();

function makeFallbackImage(title) {
  const safe = String(title || 'Produto GIRAE')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 42);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f8f8f5"/><rect x="140" y="180" width="520" height="240" rx="28" fill="#ffffff" stroke="#111111" stroke-width="6"/><rect x="176" y="216" width="88" height="14" rx="7" fill="#ffd400"/><text x="400" y="305" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="700" fill="#111111">${safe}</text><text x="400" y="348" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#666660">Pasta de fotos não encontrada</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function resolveProductImages(folderName, fotosCell, title) {
  const folderKey = normalizeSlug(folderName);
  const files = IMAGE_INDEX[folderKey] || [];

  if (files.length === 0) {
    return [makeFallbackImage(title)];
  }

  if (fotosCell && fotosCell.trim()) {
    const requested = fotosCell
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const ordered = [];
    requested.forEach((reqName) => {
      const found = files.find((f) => f.fileName.toLowerCase() === reqName);
      if (found) ordered.push(found.url);
    });

    if (ordered.length > 0) return ordered;
  }

  return files.map((f) => f.url);
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\r' && next === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
    } else if (char === '\n' || char === '\r') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function parsePrice(raw) {
  if (!raw) return 0;
  const cleaned = String(raw).replace(/R\$/gi, '').replace(/\s+/g, '').trim();
  if (!cleaned) return 0;
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned;
  const num = Number.parseFloat(normalized);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

function parseBoolean(raw) {
  const val = String(raw || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
  return val === 'SIM' || val === 'TRUE' || val === 'S' || val === '1';
}

function getStoreStyle(rawName) {
  const clean = String(rawName || '').trim();
  const key = normalizeSlug(clean);

  if (key.includes('mercado') || key.includes('meercado') || key === 'ml') {
    return { name: 'Mercado Livre', code: 'ML', shortCode: 'ML', color: '#FFE600', textColor: '#111111' };
  }
  if (key.includes('amazon')) {
    return { name: 'Amazon', code: 'AMZ', shortCode: 'AMZ', color: '#232F3E', textColor: '#FFFFFF' };
  }
  if (key.includes('shopee')) {
    return { name: 'Shopee', code: 'SHP', shortCode: 'SHP', color: '#EE4D2D', textColor: '#FFFFFF' };
  }
  if (key.includes('ali')) {
    return { name: 'AliExpress', code: 'ALI', shortCode: 'ALI', color: '#E62E04', textColor: '#FFFFFF' };
  }
  if (key.includes('kabum')) {
    return { name: 'KaBuM!', code: 'KBM', shortCode: 'KBM', color: '#FF6500', textColor: '#FFFFFF' };
  }
  if (key.includes('magalu') || key.includes('magazine')) {
    return { name: 'Magalu', code: 'MGL', shortCode: 'MGL', color: '#0086FF', textColor: '#FFFFFF' };
  }
  if (key.includes('casas-bahia') || key.includes('bahia')) {
    return { name: 'Casas Bahia', code: 'CB', shortCode: 'CB', color: '#0033C6', textColor: '#FFFFFF' };
  }
  if (key.includes('oficial')) {
    return { name: 'Loja Oficial', code: 'OF', shortCode: 'OF', color: '#111111', textColor: '#FFD400' };
  }

  const fallbackCode = clean.replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase() || 'LOJ';
  return {
    name: clean,
    code: fallbackCode,
    shortCode: fallbackCode,
    color: '#111111',
    textColor: '#FFFFFF',
  };
}

export async function fetchSheetProducts() {
  const separator = SHEET_CSV_URL.includes('?') ? '&' : '?';
  const url = `${SHEET_CSV_URL}${separator}_t=${Date.now()}`;

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Falha ao carregar planilha (${response.status})`);
  }

  const csvText = await response.text();
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const colIndex = (name) => headers.indexOf(normalizeHeader(name));

  const idxPasta = colIndex('PASTA');
  const idxFotos = colIndex('FOTOS');
  const idxTitulo = colIndex('TITULO');
  const idxCategoria = colIndex('CATEGORIA');
  const idxNichos = colIndex('NICHOS');
  const idxOriginal = colIndex('ORIGINAL');
  const idxDestaque = colIndex('DESTAQUE');

  const products = [];

  for (let r = 1; r < rows.length; r += 1) {
    const cells = rows[r];
    if (!cells || cells.every((c) => !String(c || '').trim())) continue;

    const title = idxTitulo >= 0 ? String(cells[idxTitulo] || '').trim() : '';
    const folder = idxPasta >= 0 ? String(cells[idxPasta] || '').trim() : '';

    // Ignora linhas repetidas de cabeçalho ou incompletas
    if (!title || normalizeHeader(title) === 'TITULO') continue;

    const stores = [];
    for (let s = 1; s <= 5; s += 1) {
      const iLoja = colIndex(`LOJA ${s}`);
      const iPreco = colIndex(`PRECO ${s}`);
      const iLink = colIndex(`LINK ${s}`);

      const storeName = iLoja >= 0 ? String(cells[iLoja] || '').trim() : '';
      const price = iPreco >= 0 ? parsePrice(cells[iPreco]) : 0;
      const link = iLink >= 0 ? String(cells[iLink] || '').trim() : '';

      if (storeName && price > 0) {
        const brand = getStoreStyle(storeName);
        stores.push({
          ...brand,
          price,
          url: link || '#',
        });
      }
    }

    if (stores.length === 0) continue;

    const category =
      idxCategoria >= 0 && String(cells[idxCategoria] || '').trim()
        ? String(cells[idxCategoria]).trim()
        : 'Ofertas Relâmpago';

    const nichesRaw = idxNichos >= 0 ? String(cells[idxNichos] || '').trim() : '';
    const niches = nichesRaw
      ? nichesRaw
          .split('>')
          .map((n) => n.trim())
          .filter(Boolean)
      : [];

    const fotosCell = idxFotos >= 0 ? String(cells[idxFotos] || '').trim() : '';
    const images = resolveProductImages(folder || title, fotosCell, title);

    products.push({
      id: `sheet-${normalizeSlug(folder || title)}-${r}`,
      title,
      category,
      niches,
      isOriginal: idxOriginal >= 0 ? parseBoolean(cells[idxOriginal]) : true,
      featuredWeek: idxDestaque >= 0 ? parseBoolean(cells[idxDestaque]) : false,
      impactScore: 1000 - r,
      createdAt: '2026-11-26',
      images,
      stores,
    });
  }

  return products;
}