import React, { useState } from 'react';
import {
  BookmarkIcon,
  CartIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  VerifiedIcon,
} from './Icons';
import { formatBRL, getSortedStores } from '../data/products';

export default function ProductCard({
  product,
  inCart,
  isSaved,
  onToggleCart,
  onToggleSave,
  onVisitStore,
  onOpenZoom,
  isHero = false,
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
        className="compare-row"
        onClick={() => onVisitStore(product, store)}
        title={`Ver na ${store.name}`}
      >
        <div className="compare-left">
          <span
            className="store-mini-code"
            style={{ background: store.color, color: store.textColor }}
          >
            {store.badge}
          </span>
          <span className="compare-store-label">{store.name}</span>
        </div>

        <div className="compare-right">
          <span className="compare-price">{formatBRL(store.price)}</span>
          {diff > 0 && (
            <span className="compare-diff" title="Diferença em relação ao menor preço">
              -{formatBRL(diff).replace(',00', '')}
            </span>
          )}
        </div>
      </a>
    );
  };

  return (
    <article className={`product-card ${isHero ? 'hero-card' : ''}`}>
      {/* 1. Título limpo */}
      <div className="card-title-bar">
        <h3 className="card-title" title={product.title}>
          {product.title}
        </h3>
      </div>

      {/* 2. Foto CRUA sem tarjas (apenas Original discreto no canto se aplicável) */}
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

      {/* 3. Corpo do anúncio */}
      <div className="card-body">
        {/* Barra: [Carrinho] | • • • | [Salvos] */}
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

        {/* Comparação limpa: Menor preço + 2º menor preço + Suspensório Mostrar mais */}
        <div className="price-stack">
          <a
            href={bestStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="best-price-row"
            onClick={() => onVisitStore(product, bestStore)}
            title={`Ir para ${bestStore.name}`}
          >
            <div>
              <span className="best-price-caption">Menor preço</span>
              <span className="best-price-num">{formatBRL(bestStore.price)}</span>
            </div>
            <span
              className="store-tag-solid"
              style={{ background: bestStore.color, color: bestStore.textColor }}
            >
              {bestStore.name}
            </span>
          </a>

          {secondStore && renderCompareRow(secondStore)}

          {showAllStores && extraStores.map((store) => renderCompareRow(store))}

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

        {/* Rodapé: [Carrinho] + [COMPRAR] */}
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