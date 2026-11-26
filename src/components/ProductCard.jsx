import React, { useState } from 'react';
import {
  BookmarkIcon,
  CartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  VerifiedIcon,
} from './Icons';
import { formatBRL, getMaxSavings, getSortedStores } from '../data/products';

export default function ProductCard({
  product,
  inCart,
  isSaved,
  onToggleCart,
  onToggleSave,
  onVisitStore,
  onOpenZoom,
}) {
  const [imgIndex, setImgIndex] = useState(0);

  const stores = getSortedStores(product);
  const bestStore = stores[0];
  const otherStores = stores.slice(1);
  const maxSavings = getMaxSavings(product);
  const totalImages = product.images.length;

  const handlePrev = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % totalImages);
  };

  const handleStoreClick = (store) => {
    onVisitStore(product, store);
  };

  return (
    <article className="product-card">
      {/* Título + Selo Original (quando aplicável) */}
      <div className="card-top-row">
        <h3 className="card-title" title={product.title}>
          {product.title}
        </h3>
        {product.isOriginal && (
          <span className="original-badge" title="Produto Original Verificado">
            <VerifiedIcon size={12} />
            Original
          </span>
        )}
      </div>

      {/* Carrossel de Imagens (clique abre zoom leve sem sair da vitrine) */}
      <div
        className="card-media-box"
        onClick={() => onOpenZoom(product, imgIndex)}
        title="Clique para ampliar a imagem"
      >
        {maxSavings >= 50 && (
          <span className="economy-float-tag">
            Economize até {formatBRL(maxSavings)}
          </span>
        )}

        <img
          src={product.images[imgIndex]}
          alt={product.title}
          className="card-media-img"
          loading="lazy"
        />

        {totalImages > 1 && (
          <>
            <button
              type="button"
              className="media-nav-btn prev"
              onClick={handlePrev}
              aria-label="Foto anterior"
            >
              <ChevronLeftIcon size={15} />
            </button>
            <button
              type="button"
              className="media-nav-btn next"
              onClick={handleNext}
              aria-label="Próxima foto"
            >
              <ChevronRightIcon size={15} />
            </button>
          </>
        )}
      </div>

      {/* Barra inferior da foto: Carrinho | Bolinhas | Salvos */}
      <div className="card-media-toolbar">
        <button
          type="button"
          className={`icon-toggle-btn ${inCart ? 'active-cart' : ''}`}
          onClick={() => onToggleCart(product.id)}
          title={inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
          aria-label="Adicionar ao carrinho"
        >
          <CartIcon size={16} />
        </button>

        <div className="dots-row">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`dot-btn ${idx === imgIndex ? 'active' : ''}`}
              onClick={() => setImgIndex(idx)}
              aria-label={`Ver imagem ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className={`icon-toggle-btn ${isSaved ? 'active-save' : ''}`}
          onClick={() => onToggleSave(product.id)}
          title={isSaved ? 'Remover dos salvos' : 'Salvar oferta'}
          aria-label="Salvar oferta"
        >
          <BookmarkIcon size={16} filled={isSaved} />
        </button>
      </div>

      {/* Comparador direto no anúncio (até 5 lojas com impacto de economia) */}
      <div className="price-compare-box">
        <a
          href={bestStore.url}
          target="_blank"
          rel="noopener noreferrer"
          className="best-price-block"
          onClick={() => handleStoreClick(bestStore)}
          title={`Ir para ${bestStore.name}`}
        >
          <div>
            <span className="best-price-label">Menor preço</span>
            <span className="best-price-value">{formatBRL(bestStore.price)}</span>
          </div>
          <span
            className="store-pill"
            style={{ background: bestStore.color, color: bestStore.textColor }}
          >
            {bestStore.name}
          </span>
        </a>

        <div className="compare-list">
          {otherStores.map((store) => {
            const diff = store.price - bestStore.price;
            return (
              <a
                key={store.name}
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="compare-row"
                onClick={() => handleStoreClick(store)}
                title={`Ver na ${store.name}`}
              >
                <div className="compare-store-left">
                  <span
                    className="store-mini-logo"
                    style={{ background: store.color, color: store.textColor }}
                  >
                    {store.badge}
                  </span>
                  <span className="compare-store-name">{store.name}</span>
                </div>

                <div className="compare-price-right">
                  <span className="compare-price-val">{formatBRL(store.price)}</span>
                  {diff > 0 && (
                    <span className="diff-tag" title="Quanto você economiza no menor preço">
                      -{formatBRL(diff).replace(',00', '')}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Ações finais: [Carrinho da Girae] + [COMPRAR direto na loja oficial] */}
      <div className="card-footer-actions">
        <button
          type="button"
          className={`card-cart-btn ${inCart ? 'active' : ''}`}
          onClick={() => onToggleCart(product.id)}
          title={inCart ? 'No seu carrinho' : 'Guardar no carrinho'}
          aria-label="Carrinho da loja"
        >
          <CartIcon size={18} />
        </button>

        <a
          href={bestStore.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-buy-btn"
          onClick={() => handleStoreClick(bestStore)}
        >
          COMPRAR
          <ExternalLinkIcon size={14} />
        </a>
      </div>
    </article>
  );
}