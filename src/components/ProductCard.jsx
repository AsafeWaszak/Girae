import { cheapestStore, formatBRL } from "../data/products.js";
import { HeartIcon, ProductIcon } from "./Icons.jsx";

export default function ProductCard({ product, saved, onToggleFavorite }) {
  const best = cheapestStore(product);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${product.tone}`}>
        <ProductIcon type={product.icon} />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-label={saved ? `Remover ${product.name} dos favoritos` : `Salvar ${product.name} nos favoritos`}
          aria-pressed={saved}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ${
            saved ? "text-rose-500" : "text-slate-400"
          }`}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h2 className="text-lg font-bold leading-tight text-slate-900">{product.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{product.subtitle}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Preço médio</p>
          <p className="text-sm text-slate-400 line-through">{formatBRL(product.averagePrice)}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-700">Melhor preço</p>
          <p className="text-3xl font-extrabold tracking-tight text-emerald-600">{formatBRL(best.price)}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700">Comparação entre lojas</p>
          <ul className="space-y-2">
            {product.stores.map((store) => {
              const isCheapest = store.price === best.price;
              return (
                <li
                  key={store.name}
                  className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 ${
                    isCheapest
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-100 bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {store.name}
                    {isCheapest && (
                      <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Mais barata
                      </span>
                    )}
                  </span>
                  <span className={`text-sm font-bold ${isCheapest ? "text-emerald-700" : "text-slate-800"}`}>
                    {formatBRL(store.price)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <a
          href={best.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white active:bg-blue-700"
        >
          Ir para a melhor oferta
        </a>
      </div>
    </article>
  );
}
