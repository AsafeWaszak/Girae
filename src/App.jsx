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

  const [zoomState, setZoomState] = useState(null); // { product, imgIndex }

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
    const list = PRODUCTS.filter((p) => p.featuredWeek);
    return list.sort((a, b) => b.impactScore - a.impactScore);
  }, []);

  const visibleFeatured = useMemo(() => {
    if (featuredProducts.length <= 4) return featuredProducts;
    const result = [];
    for (let i = 0; i < 4; i += 1) {
      result.push(featuredProducts[(carouselOffset + i) % featuredProducts.length]);
    }
    return result;
  }, [featuredProducts, carouselOffset]);

  // Navegação
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

  // Filtragem da página de Busca / Categorias
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

  // Nichos dinâmicos (para automaticamente quando não existem mais subnichos)
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

  // Categorias encontradas durante uma busca por texto
  const searchMatchedCategories = useMemo(() => {
    if (selectedCategory) return [];
    const set = new Set(filteredProducts.map((p) => p.category));
    return Array.from(set);
  }, [filteredProducts, selectedCategory]);

  // Listas de Carrinho e Salvos
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
      {/* ===== CABEÇALHO FIXO EM TODAS AS PÁGINAS ===== */}
      <header className="site-header">
        <div className="header-top-stripe" />
        <div className="header-inner">
          <button type="button" className="brand-btn" onClick={goHome}>
            <GiraeLogo height={34} />
            <span className="brand-tagline">
              Nós pesquisamos por você • <strong>Curadoria verificada</strong>
            </span>
          </button>

          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              className="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Qual você iria comprar?"
              aria-label="Buscar produtos"
            />
            <button type="submit" className="search-submit" aria-label="Pesquisar">
              <SearchIcon size={19} />
            </button>
          </form>

          <div className="header-actions">
            <button
              type="button"
              className={`header-nav-btn ${view === 'cart' ? 'active' : ''}`}
              onClick={() => setView('cart')}
            >
              <CartIcon size={18} />
              <span className="nav-label">Carrinho</span>
              {cartIds.length > 0 && <span className="nav-badge">{cartIds.length}</span>}
            </button>

            <button
              type="button"
              className={`header-nav-btn ${view === 'saved' ? 'active' : ''}`}
              onClick={() => setView('saved')}
            >
              <BookmarkIcon size={18} filled={view === 'saved'} />
              <span className="nav-label">Salvos</span>
              {savedIds.length > 0 && <span className="nav-badge">{savedIds.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="main-container">
        {/* ==================== HOME ==================== */}
        {view === 'home' && (
          <>
            {/* 1ª Dobra: As ofertas mais impressionantes da semana */}
            <section className="hero-section">
              <div className="section-header">
                <div className="section-title-group">
                  <h1 className="section-title">As mais impressionantes da semana</h1>
                  <span className="cyber-pill">
                    <BoltIcon size={12} />
                    Maior impacto de economia
                  </span>
                </div>

                {featuredProducts.length > 4 && (
                  <div className="carousel-controls">
                    <button
                      type="button"
                      className="carousel-arrow-btn"
                      onClick={() =>
                        setCarouselOffset(
                          (prev) =>
                            (prev - 1 + featuredProducts.length) % featuredProducts.length
                        )
                      }
                      aria-label="Ofertas anteriores"
                    >
                      <ChevronLeftIcon size={18} />
                    </button>
                    <button
                      type="button"
                      className="carousel-arrow-btn"
                      onClick={() =>
                        setCarouselOffset((prev) => (prev + 1) % featuredProducts.length)
                      }
                      aria-label="Próximas ofertas"
                    >
                      <ChevronRightIcon size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="hero-carousel-wrap">
                <div className="product-grid-4">
                  {visibleFeatured.map((product) => (
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
              </div>
            </section>

            {/* Aviso de direcionamento entre busca e categorias */}
            <div className="guide-banner">
              <div>
                <p className="guide-banner-text">
                  Veja se seu produto está aqui: pesquise na busca acima ou vá às categorias abaixo.
                </p>
                <p className="guide-banner-sub">
                  Procurando algo específico? Digite direto na barra "Qual você iria comprar?" no topo.
                </p>
              </div>
              <button
                type="button"
                className="guide-action-btn"
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedNiches([]);
                  setActiveQuery('');
                  setView('search');
                }}
              >
                Ver todas as ofertas ({PRODUCTS.length})
              </button>
            </div>

            {/* 2ª Dobra: Todas as Categorias */}
            <section className="categories-section">
              <div className="section-header">
                <h2 className="section-title">Categorias</h2>
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
                        <CategoryIcon type={cat.icon} size={21} />
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
          </>
        )}

        {/* ==================== BUSCA E CATEGORIAS ==================== */}
        {view === 'search' && (
          <div className="catalog-layout">
            <aside className="sidebar-panel">
              {/* Breadcrumb */}
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

              {/* Título e quantidade */}
              <h1 className="sidebar-main-title">
                {selectedNiches[selectedNiches.length - 1] ||
                  selectedCategory ||
                  (activeQuery ? `"${activeQuery}"` : 'Todas as ofertas')}
              </h1>
              <p className="sidebar-count">{resultRangeLabel(filteredProducts.length)}</p>

              {/* Filtros essenciais de ordenação */}
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

              {/* Nichos dinâmicos (desaparece automaticamente quando não há mais subnichos) */}
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

              {/* Categorias encontradas na pesquisa por texto */}
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
                  className="clear-filters-btn"
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
                Procurando algo específico? Use a barra de pesquisa no topo.
              </div>
            </aside>

            {/* Grade padrão de 4 produtos por linha */}
            <section>
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <h3>Nenhuma oferta encontrada para essa busca</h3>
                  <p>Tente outro termo na barra acima ou explore todas as categorias da GIRAE.</p>
                  <button type="button" className="guide-action-btn" onClick={goHome}>
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

        {/* ==================== CARRINHO ==================== */}
        {view === 'cart' && (
          <section>
            <div className="list-page-header">
              <h1 className="list-page-title">
                <CartIcon size={24} />
                Carrinho
              </h1>
              <button type="button" className="btn-secondary-sm" onClick={goHome}>
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
                <p>Use o ícone de carrinho nos anúncios para montar sua lista de compras comparada.</p>
                <button type="button" className="guide-action-btn" onClick={goHome}>
                  Explorar ofertas da semana
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
                            <span className="diff-tag">Economia de {formatBRL(savings)}</span>
                          )}
                        </div>
                      </div>
                      <div className="list-item-actions">
                        <a
                          href={best.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-buy-btn"
                          style={{ padding: '0 16px' }}
                          onClick={() => handleVisitStore(product, best)}
                        >
                          Comprar
                          <ExternalLinkIcon size={14} />
                        </a>
                        <button
                          type="button"
                          className="btn-danger-icon"
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

            {/* Histórico automático de lojas visitadas ao clicar em Comprar */}
            {visitedLog.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <div className="section-header">
                  <h2 className="section-title">Lojas que você visitou recentemente</h2>
                  <button
                    type="button"
                    className="btn-secondary-sm"
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
                              Você abriu <strong>{entry.storeName}</strong> às {entry.visitedAt}
                            </span>
                            <span className="list-item-price">{formatBRL(entry.storePrice)}</span>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <a
                            href={entry.storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary-sm"
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

        {/* ==================== SALVOS ==================== */}
        {view === 'saved' && (
          <section>
            <div className="list-page-header">
              <h1 className="list-page-title">
                <BookmarkIcon size={24} filled />
                Salvos
              </h1>
              <button type="button" className="btn-secondary-sm" onClick={goHome}>
                Continuar vendo ofertas
              </button>
            </div>

            {savedProducts.length === 0 ? (
              <div className="empty-state">
                <h3>Nenhuma oferta salva ainda</h3>
                <p>Clique no ícone de marcador nos anúncios para acompanhar os preços depois.</p>
                <button type="button" className="guide-action-btn" onClick={goHome}>
                  Explorar ofertas da semana
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
                          className="btn-secondary-sm"
                          onClick={() => toggleCart(product.id)}
                        >
                          <CartIcon size={15} />
                          {inCart ? 'No carrinho' : 'Add carrinho'}
                        </button>
                        <a
                          href={best.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-buy-btn"
                          style={{ padding: '0 16px' }}
                          onClick={() => handleVisitStore(product, best)}
                        >
                          Comprar
                          <ExternalLinkIcon size={14} />
                        </a>
                        <button
                          type="button"
                          className="btn-danger-icon"
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

      {/* ===== MODAL DE ZOOM RÁPIDO DA IMAGEM ===== */}
      {zoomState && (
        <div className="modal-backdrop" onClick={() => setZoomState(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="card-title">{zoomState.product.title}</h3>
              <button
                type="button"
                className="icon-toggle-btn"
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
                <span className="best-price-label">Menor preço verificado</span>
                <span className="best-price-value">
                  {formatBRL(getSortedStores(zoomState.product)[0].price)}
                </span>
              </div>
              <a
                href={getSortedStores(zoomState.product)[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-buy-btn"
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