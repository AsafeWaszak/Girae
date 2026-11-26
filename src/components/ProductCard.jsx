import React, { useState } from 'react';
import {
  ArrowUpRightIcon,
  BookmarkIcon,
  CartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  VerifiedIcon,
} from './Icons';
import { formatBRL, getSortedStores } from '../data/products';

/* Anatomia de preço de varejo real: R$ menor + inteiro em destaque + centavos elevados */
export function PriceDisplay({ value, size = 'md' }) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  const [intPart, decPart] = formatted.split(',');

  return (
    <span className={`retail-price retail-price--${size}`}>
      <span className="retail-currency">R$</span>
      <span className="retail-int">{intPart}</span>
      <span className="retail-cents">,{decPart}</span>
    </span>
  );
}

/* Indicador limpo de loja: ponto na cor oficial da loja + nome sem siglas artificiais */
export function StoreNameTag({ store, emphasis = false }) {
  return (
    <span className={`store-identity ${emphasis ? 'is-best' : ''}`}>
      <span
        className="store-dot"
        style={{ backgroundColor: store.color }}
        aria-hidden="true"
      />
      <span className="store-name-text">{store.name}</span>
    </span>
  );
}

/* ===== CARD EXCLUSIVO DOS 4 DESTAQUES DA HOME (LIMPO, OVAL E INTERATIVO) ===== */
export function HeroSpotlightCard({
  product,
  inCart,
  isSaved,
  onToggleCart,
  onToggleSave,
  onOpenOffer,
}) {
  const stores = getSortedStores(product);
  const bestStore = stores[0];
  const secondStore = stores[1];
  const diff = secondStore ? secondStore.price - bestStore.price : 0;

  return (
    <article
      className="spotlight-card"
      onClick={() => onOpenOffer(product, 0)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenOffer(product, 0);
        }
      }}
      title="Clique para comparar todas as lojas e comprar"
    >
      <div className="spotlight-top-row">
        <div>
          {product.isOriginal && (
            <span className="spotlight-original">
              <VerifiedIcon size={13} />
              Original
            </span>
          )}
        </div>

        <div className="spotlight-top-actions">
          <button
            type="button"
            className={`spotlight-icon-btn ${inCart ? 'active-cart' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCart(product.id);
            }}
            title={inCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}
            aria-label="Adicionar ao carrinho"
          >
            <CartIcon size={15} />
          </button>

          <button
            type="button"
            className={`spotlight-icon-btn ${isSaved ? 'active-save' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(product.id);
            }}
            title={isSaved ? 'Remover dos salvos' : 'Salvar oferta'}
            aria-label="Salvar oferta"
          >
            <BookmarkIcon size={15} filled={isSaved} />
          </button>
        </div>
      </div>

      <div className="spotlight-visual-stage">
        <div className="spotlight-oval-halo" />
        <img
          src={product.images[0]}
          alt={product.title}
          className="spotlight-product-img"
          loading="lazy"
        />
      </div>

      <h3 className="spotlight-title" title={product.title}>
        {product.title}
      </h3>

      <div className="spotlight-prices">
        <div className="spotlight-best-wrap">
          <PriceDisplay value={bestStore.price} size="xl" />
          <div className="spotlight-store-sub">
            <span>na</span>
            <StoreNameTag store={bestStore} emphasis />
          </div>
        </div>

        {secondStore && (
          <div className="spotlight-compare-line">
            <span className="spotlight-compare-store">
              {secondStore.name} {formatBRL(secondStore.price)}
            </span>
            {diff > 0 && (
              <span className="diff-inline">
                -{formatBRL(diff).replace(',00', '')}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/* ===== CARD COMPLETO PARA AS PÁGINAS DE BUSCA E CATEGORIAS ===== */
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
  const [showAllStores, setShowAllStores] = useState(false);

  const stores = getSortedStores(product);
  const bestStore = stores[0];
  const secondStore = stores[1];
  const extraStores = stores.slice(2);
  const totalImages = product.images.length;

  const handlePrev = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % totalImages);
  };

  const renderCompareRow = (store) => {
    const diff = store.price - bestStore.price;
    return (
      <a
        key={store.name}
        href={store.url}
        target="_blank"
        rel="noopener noreferrer"
        className="compare-line-item"
        onClick={() => onVisitStore(product, store)}
        title={`Abrir oferta na ${store.name}`}
      >
        <StoreNameTag store={store} />

        <div className="compare-line-right">
          <span className="compare-line-price">{formatBRL(store.price)}</span>
          {diff > 0 && (
            <span className="diff-inline" title="Diferença para o menor preço">
              -{formatBRL(diff).replace(',00', '')}
            </span>
          )}
          <span className="hover-arrow">
            <ArrowUpRightIcon size={13} />
          </span>
        </div>
      </a>
    );
  };

  return (
    <article className="product-card">
      <div className="card-title-bar">
        <h3 className="card-title" title={product.title}>
          {product.title}
        </h3>
      </div>

      <div
        className="card-media-box"
        onClick={() => onOpenZoom(product, imgIndex)}
        title="Clique para ampliar"
      >
        {product.isOriginal && (
          <span className="original-stamp" title="Produto Original">
            <VerifiedIcon size={13} />
            Original
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

      <div className="card-body">
        <div className="card-media-toolbar">
          <button
            type="button"
            className={`mini-pop-icon ${inCart ? 'active-cart' : ''}`}
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
            className={`mini-pop-icon ${isSaved ? 'active-save' : ''}`}
            onClick={() => onToggleSave(product.id)}
            title={isSaved ? 'Remover dos salvos' : 'Salvar oferta'}
            aria-label="Salvar oferta"
          >
            <BookmarkIcon size={16} filled={isSaved} />
          </button>
        </div>

        {/* Bloco editorial de preços sem "cara de corretora/IA" */}
        <div className="price-stack">
          <a
            href={bestStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="best-price-link"
            onClick={() => onVisitStore(product, bestStore)}
            title={`Ir para ${bestStore.name}`}
          >
            <div className="best-price-meta-top">
              <span className="best-price-kicker">Menor preço</span>
              <StoreNameTag store={bestStore} emphasis />
            </div>

            <div className="best-price-main-line">
              <PriceDisplay value={bestStore.price} size="lg" />
              <span className="best-price-go">
                <ArrowUpRightIcon size={16} />
              </span>
            </div>
          </a>

          {secondStore && (
            <div className="compare-lines-group">
              {renderCompareRow(secondStore)}
              {showAllStores && extraStores.map((store) => renderCompareRow(store))}
            </div>
          )}

          {extraStores.length > 0 && (
            <button
              type="button"
              className="show-more-stores-btn"
              onClick={() => setShowAllStores((prev) => !prev)}
            >
              {showAllStores
                ? 'Mostrar menos'
                : `••• Mostrar mais (+${extraStores.length})`}
            </button>
          )}
        </div>

        <div className="card-footer-actions">
          <button
            type="button"
            className={`pop-btn card-cart-btn ${inCart ? 'active' : ''}`}
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
            className="pop-btn card-buy-btn"
            onClick={() => onVisitStore(product, bestStore)}
          >
            Comprar
            <ExternalLinkIcon size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}