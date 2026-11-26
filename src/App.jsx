import React, { useEffect, useMemo, useState } from 'react';
import {
  BoltIcon,
  BookmarkIcon,
  CartIcon,
  CategoryIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExternalLinkIcon,
  GiraeLogo,
  SearchIcon,
  TrashIcon,
} from './components/Icons';
import ProductCard from './components/ProductCard';
import {
  CATEGORIES,
  PRODUCTS,
  formatBRL,
  getMaxSavings,
  getSortedStores,
} from './data/products';

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [view, setView] = useState('home'); // 'home' | 'search' | 'cart' | 'saved'
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [sortBy, setSortBy] = useState('impressive');
  const [carouselOffset, setCarouselOffset] = useState(0);

  const [cartIds, setCartIds] = useState(() => loadStorage('girae_cart', []));
  const [savedIds, setSavedIds] = useState(() => loadStorage('girae_saved', []));
  const [visitedLog, setVisitedLog] = useState(() => loadStorage('girae_visited', []));

  const [zoomState, setZoomState] = useState(null);

  useEffect(() => {
    localStorage.setItem('girae_cart', JSON.stringify(cartIds));
  }, [cartIds]);

  useEffect(() => {
    localStorage.setItem('girae_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('girae_visited', JSON.stringify(visitedLog));
  }, [visitedLog]);

  const featuredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.featuredWeek).sort(
      (a, b) => b.impactScore - a.impactScore
    );
  }, []);

  const visibleFeatured = useMemo(() => {
    if (featuredProducts.length <= 4) return featuredProducts;
    const result = [];
    for (let i = 0; i < 4; i += 1) {
      result.push(featuredProducts[(carouselOffset + i) % featuredProducts.length]);
    }
    return result;
  }, [featuredProducts, carouselOffset]);

  const goHome = () => {
    setView('home');
    setSelectedCategory(null);
    setSelectedNiches([]);
    setActiveQuery('');
    setSearchInput('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedNiches([]);
    setActiveQuery('');
    setSearchInput('');
    setSortBy('impressive');
    setView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    setActiveQuery(trimmed);
    setSelectedCategory(null);
    setSelectedNiches([]);
    setSortBy('impressive');
    setView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCart = (productId) => {
    setCartIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]
    );
  };

  const toggleSave = (productId) => {
    setSavedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]
    );
  };

  const handleVisitStore = (product, store) => {
    setVisitedLog((prev) => {
      const filtered = prev.filter((item) => item.productId !== product.id);
      return [
        {
          productId: product.id,
          storeName: store.name,
          storePrice: store.price,
          storeUrl: store.url,
          visitedAt: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
        ...filtered,
      ].slice(0, 12);
    });
  };

  const filteredProducts = useMemo(() => {
    const q = activeQuery.toLowerCase();

    const list = PRODUCTS.filter((product) => {
      if (selectedCategory && selectedCategory !== 'Ofertas Relâmpago') {
        if (product.category !== selectedCategory) return false;
      }

      if (selectedNiches.length > 0) {
        const matchesNiches = selectedNiches.every(
          (niche, idx) => product.niches[idx] === niche
        );
        if (!matchesNiches) return false;
      }

      if (q) {
        const haystack = [
          product.title,
          product.category,
          ...product.niches,
          ...product.stores.map((s) => s.name),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...list];
    if (sortBy === 'impressive') {
      sorted.sort((a, b) => b.impactScore - a.impactScore);
    } else if (sortBy === 'price_asc') {
      sorted.sort((a, b) => getSortedStores(a)[0].price - getSortedStores(b)[0].price);
    } else if (sortBy === 'price_desc') {
      sorted.sort((a, b) => getSortedStores(b)[0].price - getSortedStores(a)[0].price);
    } else if (sortBy === 'alpha') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return sorted;
  }, [activeQuery, selectedCategory, selectedNiches, sortBy]);

  const availableNextNiches = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'Ofertas Relâmpago') return [];
    const depth = selectedNiches.length;
    const set = new Set();

    filteredProducts.forEach((p) => {
      if (p.niches[depth]) {
        set.add(p.niches[depth]);
      }
    });

    return Array.from(set);
  }, [filteredProducts, selectedCategory, selectedNiches]);

  const searchMatchedCategories = useMemo(() => {
    if (selectedCategory) return [];
    const set = new Set(filteredProducts.map((p) => p.category));
    return Array.from(set);
  }, [filteredProducts, selectedCategory]);

  const cartProducts = useMemo(
    () => cartIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean),
    [cartIds]
  );

  const savedProducts = useMemo(
    () => savedIds.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean),
    [savedIds]
  );

  const cartTotals = useMemo(() => {
    return cartProducts.reduce(
      (acc, product) => {
        acc.total += getSortedStores(product)[0].price;
        acc.savings += getMaxSavings(product);
        return acc;
      },
      { total: 0, savings: 0 }
    );
  }, [cartProducts]);

  const resultRangeLabel = (count) => {
    if (count === 0) return 'Nenhum resultado';
    if (count === 1) return '1 resultado';
    if (count < 10) return `${count} resultados (< 10)`;
    if (count < 100) return `${count} resultados (< 100)`;
    return `${count} resultados (> 100)`;
  };

  return (
    <div>
      {/* ===== FAIXA FINA DE CONFIANÇA NO TOPO ===== */}
      <div className="top-trust-bar">
        <div className="top-trust-inner">
          <span className="top-trust-bolt">
            <BoltIcon size={13} />
          </span>
          <span>Pesquisamos nas maiores lojas por você</span>
          <span className="top-trust-sep">•</span>
          <span className="top-trust-highlight">Curadoria verificada</span>
        </div>
      </div>

      {/* ===== CABEÇALHO FIXO AMARELO GIRAE ===== */}
      <header className={`site-header ${view === 'home' ? 'on-home' : ''}`}>
        <div className="header-inner">
          <button type="button" className="brand-btn" onClick={goHome} aria-label="Ir para o início da GIRAE">
            <GiraeLogo height={44} variant="onYellow" />
          </button>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="O que você quer comprar mais barato?"
              aria-label="Buscar produtos"
            />
            <button type="submit" className="search-submit" aria-label="Pesquisar">
              <SearchIcon size={19} />
            </button>
          </form>

          <div className="header-actions">
            <button
              type="button"
              className={`pop-btn header-nav-btn ${view === 'cart' ? 'active' : ''}`}
              onClick={() => setView('cart')}
            >
              <CartIcon size={18} />
              <span className="nav-label">Carrinho</span>
              {cartIds.length > 0 && <span className="nav-badge">{cartIds.length}</span>}
            </button>

            <button
              type="button"
              className={`pop-btn header-nav-btn ${view === 'saved' ? 'active' : ''}`}
              onClick={() => setView('saved')}
            >
              <BookmarkIcon size={18} filled={view === 'saved'} />
              <span className="nav-label">Salvos</span>
              {savedIds.length > 0 && <span className="nav-badge">{savedIds.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HOME ==================== */}
      {view === 'home' && (
        <>
          {/* 1ª Dobra: Cards arredondados flutuando sobre o corte amarelo/branco */}
          <section className="hero-stage">
            <div className="hero-stage-inner">
              <div className="hero-heading-row">
                <h1 className="hero-title">As mais impressionantes da semana</h1>
              </div>

              <div className="hero-carousel-shell">
                <button
                  type="button"
                  className="hero-side-arrow"
                  onClick={() =>
                    setCarouselOffset(
                      (prev) =>
                        (prev - 1 + featuredProducts.length) % featuredProducts.length
                    )
                  }
                  aria-label="Ofertas anteriores"
                >
                  <ChevronLeftIcon size={28} />
                </button>

                <div className="product-grid-4">
                  {visibleFeatured.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isHero
                      inCart={cartIds.includes(product.id)}
                      isSaved={savedIds.includes(product.id)}
                      onToggleCart={toggleCart}
                      onToggleSave={toggleSave}
                      onVisitStore={handleVisitStore}
                      onOpenZoom={(p, idx) => setZoomState({ product: p, imgIndex: idx })}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="hero-side-arrow"
                  onClick={() =>
                    setCarouselOffset((prev) => (prev + 1) % featuredProducts.length)
                  }
                  aria-label="Próximas ofertas"
                >
                  <ChevronRightIcon size={28} />
                </button>
              </div>
            </div>
          </section>

          {/* 2ª Dobra: Aviso limpo + Categorias em destaque */}
          <main className="main-container">
            <div className="simple-guide-bar">
              <p>Pesquise na busca acima ou escolha uma categoria abaixo</p>
              <span>Procurando algo específico? Digite direto na barra "O que você quer comprar mais barato?".</span>
            </div>

            <section>
              <div className="categories-header-bar">
                <span className="categories-accent-bar" />
                <h2 className="categories-title">Categorias</h2>
                <span className="categories-header-line" />
                <span className="categories-subtitle">Explore por departamento</span>
              </div>

              <div className="categories-grid">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat.name === 'Ofertas Relâmpago'
                      ? PRODUCTS.length
                      : PRODUCTS.filter((p) => p.category === cat.name).length;

                  return (
                    <button
                      key={cat.name}
                      type="button"
                      className="category-card"
                      onClick={() => openCategory(cat.name)}
                    >
                      <div className="category-icon-box">
                        <CategoryIcon type={cat.icon} size={22} />
                      </div>
                      <div>
                        <div className="category-name">{cat.name}</div>
                        <div className="category-meta">
                          {cat.description} • {count} {count === 1 ? 'oferta' : 'ofertas'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </main>
        </>
      )}

      {/* ==================== BUSCA, CARRINHO E SALVOS ==================== */}
      {view !== 'home' && (
        <main className="main-container">
          {view === 'search' && (
            <div className="catalog-layout">
              <aside className="sidebar-panel">
                <div className="breadcrumb-row">
                  <button type="button" className="breadcrumb-link" onClick={goHome}>
                    Início
                  </button>
                  {selectedCategory && (
                    <>
                      <span>/</span>
                      <button
                        type="button"
                        className="breadcrumb-link"
                        onClick={() => setSelectedNiches([])}
                      >
                        {selectedCategory}
                      </button>
                    </>
                  )}
                  {selectedNiches.map((niche, index) => (
                    <React.Fragment key={niche}>
                      <span>/</span>
                      <button
                        type="button"
                        className="breadcrumb-link"
                        onClick={() => setSelectedNiches(selectedNiches.slice(0, index + 1))}
                      >
                        {niche}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                <h1 className="sidebar-main-title">
                  {selectedNiches[selectedNiches.length - 1] ||
                    selectedCategory ||
                    (activeQuery ? `"${activeQuery}"` : 'Resultados')}
                </h1>
                <p className="sidebar-count">{resultRangeLabel(filteredProducts.length)}</p>

                <div className="sidebar-block">
                  <div className="sidebar-block-title">Filtro</div>
                  <div className="filter-list">
                    {[
                      { id: 'impressive', label: 'Mais impressionantes' },
                      { id: 'price_asc', label: 'Menor preço' },
                      { id: 'price_desc', label: 'Maior preço' },
                      { id: 'alpha', label: 'Ordem alfabética (A-Z)' },
                      { id: 'newest', label: 'Mais recentes' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`filter-option-btn ${sortBy === opt.id ? 'active' : ''}`}
                        onClick={() => setSortBy(opt.id)}
                      >
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {availableNextNiches.length > 0 && (
                  <div className="sidebar-block">
                    <div className="sidebar-block-title">Nichos</div>
                    <div className="filter-list">
                      {availableNextNiches.map((niche) => (
                        <button
                          key={niche}
                          type="button"
                          className="filter-option-btn"
                          onClick={() => setSelectedNiches((prev) => [...prev, niche])}
                        >
                          <span>{niche}</span>
                          <ChevronRightIcon size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!selectedCategory && searchMatchedCategories.length > 0 && (
                  <div className="sidebar-block">
                    <div className="sidebar-block-title">Categorias</div>
                    <div className="filter-list">
                      {searchMatchedCategories.map((catName) => (
                        <button
                          key={catName}
                          type="button"
                          className="filter-option-btn"
                          onClick={() => setSelectedCategory(catName)}
                        >
                          <span>{catName}</span>
                          <ChevronRightIcon size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedCategory || selectedNiches.length > 0 || activeQuery) && (
                  <button
                    type="button"
                    className="pop-btn clear-filters-btn"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedNiches([]);
                      setActiveQuery('');
                      setSearchInput('');
                    }}
                  >
                    Limpar filtros
                  </button>
                )}

                <div className="sidebar-tip">
                  Algo específico? Digite direto na barra de pesquisa no topo.
                </div>
              </aside>

              <section>
                {filteredProducts.length === 0 ? (
                  <div className="empty-state">
                    <h3>Nenhuma oferta encontrada</h3>
                    <p>Tente outro termo na barra acima ou volte para explorar as categorias.</p>
                    <button
                      type="button"
                      className="pop-btn btn-action-sm"
                      style={{ background: 'var(--girae-yellow)' }}
                      onClick={goHome}
                    >
                      Voltar para o início
                    </button>
                  </div>
                ) : (
                  <div className="product-grid-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        inCart={cartIds.includes(product.id)}
                        isSaved={savedIds.includes(product.id)}
                        onToggleCart={toggleCart}
                        onToggleSave={toggleSave}
                        onVisitStore={handleVisitStore}
                        onOpenZoom={(p, idx) => setZoomState({ product: p, imgIndex: idx })}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {view === 'cart' && (
            <section>
              <div className="list-page-header">
                <h1 className="list-page-title">
                  <CartIcon size={25} />
                  Carrinho
                </h1>
                <button type="button" className="pop-btn btn-action-sm" onClick={goHome}>
                  Continuar vendo ofertas
                </button>
              </div>

              {cartProducts.length > 0 && (
                <div className="cart-summary-bar">
                  <div className="summary-metric">
                    <span>Itens na sua lista</span>
                    <strong>{cartProducts.length}</strong>
                  </div>
                  <div className="summary-metric">
                    <span>Total nos menores preços</span>
                    <strong>{formatBRL(cartTotals.total)}</strong>
                  </div>
                  <div className="summary-metric savings">
                    <span>Economia estimada</span>
                    <strong>{formatBRL(cartTotals.savings)}</strong>
                  </div>
                </div>
              )}

              {cartProducts.length === 0 ? (
                <div className="empty-state">
                  <h3>Seu carrinho está vazio</h3>
                  <p>Clique no ícone de carrinho nos anúncios para montar sua lista de compras.</p>
                  <button
                    type="button"
                    className="pop-btn btn-action-sm"
                    style={{ background: 'var(--girae-yellow)' }}
                    onClick={goHome}
                  >
                    Ver ofertas da semana
                  </button>
                </div>
              ) : (
                <div className="vertical-list-card">
                  {cartProducts.map((product) => {
                    const best = getSortedStores(product)[0];
                    const savings = getMaxSavings(product);
                    return (
                      <div key={product.id} className="list-item-row">
                        <img src={product.images[0]} alt={product.title} className="list-thumb" />
                        <div className="list-item-info">
                          <h3>{product.title}</h3>
                          <div className="list-item-meta">
                            <span className="list-item-price">{formatBRL(best.price)}</span>
                            <span>Menor preço na <strong>{best.name}</strong></span>
                            {savings > 0 && (
                              <span className="compare-diff">-{formatBRL(savings).replace(',00', '')}</span>
                            )}
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <a
                            href={best.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pop-btn card-buy-btn"
                            style={{ padding: '0 18px' }}
                            onClick={() => handleVisitStore(product, best)}
                          >
                            Comprar
                            <ExternalLinkIcon size={14} />
                          </a>
                          <button
                            type="button"
                            className="pop-btn btn-danger-icon"
                            onClick={() => toggleCart(product.id)}
                            title="Remover do carrinho"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {visitedLog.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <div className="list-page-header">
                    <h2 className="section-title" style={{ marginBottom: 0 }}>
                      Lojas visitadas recentemente
                    </h2>
                    <button
                      type="button"
                      className="pop-btn btn-action-sm"
                      onClick={() => setVisitedLog([])}
                    >
                      Limpar histórico
                    </button>
                  </div>

                  <div className="vertical-list-card">
                    {visitedLog.map((entry) => {
                      const product = PRODUCTS.find((p) => p.id === entry.productId);
                      if (!product) return null;
                      return (
                        <div key={entry.productId} className="list-item-row">
                          <img src={product.images[0]} alt={product.title} className="list-thumb" />
                          <div className="list-item-info">
                            <h3>{product.title}</h3>
                            <div className="list-item-meta">
                              <span>
                                Aberto na <strong>{entry.storeName}</strong> às {entry.visitedAt}
                              </span>
                              <span className="list-item-price">{formatBRL(entry.storePrice)}</span>
                            </div>
                          </div>
                          <div className="list-item-actions">
                            <a
                              href={entry.storeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="pop-btn btn-action-sm"
                            >
                              Voltar à loja
                              <ExternalLinkIcon size={14} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}

          {view === 'saved' && (
            <section>
              <div className="list-page-header">
                <h1 className="list-page-title">
                  <BookmarkIcon size={25} filled />
                  Salvos
                </h1>
                <button type="button" className="pop-btn btn-action-sm" onClick={goHome}>
                  Continuar vendo ofertas
                </button>
              </div>

              {savedProducts.length === 0 ? (
                <div className="empty-state">
                  <h3>Nenhuma oferta salva ainda</h3>
                  <p>Clique no marcador nos anúncios para guardar e acompanhar depois.</p>
                  <button
                    type="button"
                    className="pop-btn btn-action-sm"
                    style={{ background: 'var(--girae-yellow)' }}
                    onClick={goHome}
                  >
                    Ver ofertas da semana
                  </button>
                </div>
              ) : (
                <div className="vertical-list-card">
                  {savedProducts.map((product) => {
                    const best = getSortedStores(product)[0];
                    const inCart = cartIds.includes(product.id);
                    return (
                      <div key={product.id} className="list-item-row">
                        <img src={product.images[0]} alt={product.title} className="list-thumb" />
                        <div className="list-item-info">
                          <h3>{product.title}</h3>
                          <div className="list-item-meta">
                            <span className="list-item-price">{formatBRL(best.price)}</span>
                            <span>Menor preço na <strong>{best.name}</strong></span>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <button
                            type="button"
                            className="pop-btn btn-action-sm"
                            onClick={() => toggleCart(product.id)}
                          >
                            <CartIcon size={15} />
                            {inCart ? 'No carrinho' : 'Add carrinho'}
                          </button>
                          <a
                            href={best.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pop-btn card-buy-btn"
                            style={{ padding: '0 18px' }}
                            onClick={() => handleVisitStore(product, best)}
                          >
                            Comprar
                            <ExternalLinkIcon size={14} />
                          </a>
                          <button
                            type="button"
                            className="pop-btn btn-danger-icon"
                            onClick={() => toggleSave(product.id)}
                            title="Remover dos salvos"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </main>
      )}

      {/* ===== MODAL DE ZOOM RÁPIDO ===== */}
      {zoomState && (
        <div className="modal-backdrop" onClick={() => setZoomState(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="card-title">{zoomState.product.title}</h3>
              <button
                type="button"
                className="mini-pop-icon"
                onClick={() => setZoomState(null)}
                aria-label="Fechar zoom"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="modal-img-wrap">
              <img
                src={zoomState.product.images[zoomState.imgIndex]}
                alt={zoomState.product.title}
              />
              {zoomState.product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="media-nav-btn prev"
                    onClick={() =>
                      setZoomState((prev) => ({
                        ...prev,
                        imgIndex:
                          (prev.imgIndex - 1 + prev.product.images.length) %
                          prev.product.images.length,
                      }))
                    }
                  >
                    <ChevronLeftIcon size={16} />
                  </button>
                  <button
                    type="button"
                    className="media-nav-btn next"
                    onClick={() =>
                      setZoomState((prev) => ({
                        ...prev,
                        imgIndex: (prev.imgIndex + 1) % prev.product.images.length,
                      }))
                    }
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </>
              )}
            </div>

            <div className="modal-footer">
              <div>
                <span className="best-price-caption">Menor preço verificado</span>
                <span className="best-price-num">
                  {formatBRL(getSortedStores(zoomState.product)[0].price)}
                </span>
              </div>
              <a
                href={getSortedStores(zoomState.product)[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="pop-btn card-buy-btn"
                style={{ padding: '0 22px' }}
                onClick={() =>
                  handleVisitStore(
                    zoomState.product,
                    getSortedStores(zoomState.product)[0]
                  )
                }
              >
                Ir para {getSortedStores(zoomState.product)[0].name}
                <ExternalLinkIcon size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}