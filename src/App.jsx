import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./components/ProductCard.jsx";
import { HeartIcon, HomeIcon, RadarMark, SearchIcon } from "./components/Icons.jsx";
import { products } from "./data/products.js";

const TABS = [
  { id: "inicio", label: "Início", icon: HomeIcon },
  { id: "buscar", label: "Buscar", icon: SearchIcon },
  { id: "favoritos", label: "Favoritos", icon: HeartIcon },
];

const FAVORITES_KEY = "girae-favoritos";

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function normalize(text) {
  return text
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export default function App() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("inicio");
  const [favorites, setFavorites] = useState(loadFavorites);
  const searchRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (tab === "buscar") {
      searchRef.current?.focus();
    }
  }, [tab]);

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return products;
    return products.filter((product) =>
      normalize(`${product.name} ${product.subtitle} ${product.keywords}`).includes(term)
    );
  }, [query]);

  const visible = tab === "favoritos"
    ? filtered.filter((product) => favorites.includes(product.id))
    : filtered;

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  const title = tab === "favoritos" ? "Favoritos" : tab === "buscar" ? "Buscar ofertas" : "Ofertas de hoje";

  return (
    <div className="min-h-screen bg-slate-200">
      <div className="relative mx-auto min-h-screen w-full max-w-lg bg-slate-50 shadow-xl">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <RadarMark />
            </span>
            <div>
              <p className="text-xl font-extrabold tracking-tight text-slate-900">Girae</p>
              <p className="text-xs text-slate-500">Radar de ofertas</p>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="sr-only">Buscar produtos</span>
            <span className="relative block">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar produtos..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-base text-slate-900 outline-none ring-blue-500 placeholder:text-slate-400 focus:bg-white focus:ring-2"
              />
            </span>
          </label>
        </header>

        <main className="px-4 pb-28 pt-4">
          <div className="mb-4 flex items-end justify-between">
            <h1 className="text-base font-semibold text-slate-800">{title}</h1>
            <p className="text-xs text-slate-500">
              {visible.length} {visible.length === 1 ? "produto" : "produtos"}
            </p>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-base font-semibold text-slate-800">
                {tab === "favoritos" && !query.trim()
                  ? "Nenhum favorito ainda"
                  : "Nenhum produto encontrado"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {tab === "favoritos" && !query.trim()
                  ? "Toque no coração de uma oferta para salvar aqui."
                  : "Tente outro nome, como PlayStation, iPhone ou TV."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  saved={favorites.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-lg -translate-x-1/2 border-t border-slate-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur">
          <ul className="grid grid-cols-3">
            {TABS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`flex w-full flex-col items-center gap-0.5 rounded-2xl py-2 text-xs font-semibold ${
                      active ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    <span className="relative">
                      {item.id === "favoritos" ? (
                        <HeartIcon filled={active} className="h-6 w-6" />
                      ) : (
                        <Icon />
                      )}
                      {item.id === "favoritos" && favorites.length > 0 && (
                        <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                          {favorites.length}
                        </span>
                      )}
                    </span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
