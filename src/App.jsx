import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRightIcon,
  BoltIcon,
  BookmarkIcon,
  CartIcon,
  CategoryIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  ExternalLinkIcon,
  GiraeLogo,
  GoogleIcon,
  HomeIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
  VerifiedIcon,
} from './components/Icons';
import ProductCard, {
  HeroSpotlightCard,
  RetailPrice,
  formatDiffCompact,
} from './components/ProductCard';
import { LegalFooter, LegalModal } from './components/LegalFooter';
import { AccountSettingsModal, LoginModal } from './components/AuthAndAccount';
import {
  CATEGORIES,
  PRODUCTS,
  formatBRL,
  getMaxSavings,
  getSortedStores,
} from './data/products';
import { KEEP_DEMO_PRODUCTS, fetchSheetProducts } from './data/sheetCatalog';

function loadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState('home'); // 'home' | 'search' | 'cart' | 'saved'
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [sortBy, setSortBy] = useState('impressive');
  const [carouselOffset, setCarouselOffset] = useState(0);

  const [allProducts, setAllProducts] = useState(PRODUCTS);

  const [cartIds, setCartIds] = useState(() => loadStorage('girae_cart', []));
  const [savedIds, setSavedIds] = useState(() => loadStorage('girae_saved', []));
  const [visitedLog, setVisitedLog] = useState(() => loadStorage('girae_visited', []));
  const [user, setUser] = useState(() => loadStorage('girae_user', null));

  const [offerModal, setOfferModal] = useState(null);
  const [legalTab, setLegalTab] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginInitialMode, setLoginInitialMode] = useState('login');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef(null);

  useEffect(() => {
    let active = true;
    fetchSheetProducts()
      .then((sheetItems) => {
        if (!active || sheetItems.length === 0) return;
        setAllProducts(KEEP_DEMO_PRODUCTS ? [...sheetItems, ...PRODUCTS] : sheetItems);
      })
      .catch((err) => {
        console.warn('GIRAE: erro ao ler planilha ao vivo, mantendo catálogo local.', err);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('girae_cart', JSON.stringify(cartIds));
  }, [cartIds]);

  useEffect(() => {
    localStorage.setItem('girae_saved', JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem('girae_visited', JSON.stringify(visitedLog));
  }, [visitedLog]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('girae_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('girae_user');
    }
  }, [user]);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;
    const handleOutsideClick = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setAccountMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [accountMenuOpen]);

  const openLogin = (mode = 'login') => {
    setAccountMenuOpen(false);
    setLoginInitialMode(mode);
    setLoginModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    setAccountMenuOpen(false);
    setSettingsOpen(false);
  };

  const handleDeleteAccount = () => {
    setUser(null);
    setCartIds([]);
    setSavedIds([]);
    setVisitedLog([]);
    setSettingsOpen(false);
    setAccountMenuOpen(false);
  };

  const allCategories = useMemo(() => {
    const activeNames = new Set(
      allProducts.map((p) => p.category).filter(Boolean)
    );
    const base = CATEGORIES.filter((c) => activeNames.has(c.name));
    const baseNames = new Set(base.map((c) => c.name));
    const extras = [];

    activeNames.forEach((catName) => {
      if (!baseNames.has(catName)) {
        extras.push({
          name: catName,
          icon: 'bolt',
          description: 'Ofertas comparadas',
        });
      }
    });

    return [...base, ...extras];
  }, [allProducts]);

  const featuredProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.featuredWeek)
      .sort((a, b) => b.impactScore - a.impactScore);
  }, [allProducts]);

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
    setAccountMenuOpen(false);
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

  const goToVisitedHistory = () => {
    setAccountMenuOpen(false);
    setView('cart');
    setTimeout(() => {
      const el = document.getElementById('visited-history');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  };

  const filteredProducts = useMemo(() => {
    const q = activeQuery.toLowerCase();

    const list = allProducts.filter((product) => {
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
  }, [allProducts, activeQuery, selectedCategory, selectedNiches, sortBy]);

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
    () => cartIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean),
    [allProducts, cartIds]
  );

  const savedProducts = useMemo(
    () => savedIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean),
    [allProducts, savedIds]
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

  const userFirstName = user ? user.name.trim().split(' ')[0] : '';
  const userInitial = user ? user.name.trim().charAt(0).toUpperCase() : '';

  return (
    <div className="app-shell">
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
          <button
            type="button"
            className="brand-btn"
            onClick={goHome}
            aria-label="Ir para o início da GIRAE"
          >
            <GiraeLogo height={44} variant="onYellow" />
          </button>

          {/* Casinha (Início) colada à esquerda da barra de busca */}
          <div className="header-search-group">
            <button
              type="button"
              className={`pop-btn home-icon-btn ${view === 'home' ? 'active' : ''}`}
              onClick={goHome}
              title="Voltar para a página inicial"
              aria-label="Página inicial"
            >
              <HomeIcon size={20} />
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
          </div>

          <div
  className="header-actions"
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
  }}
>
  <span
    style={{
      fontSize: '12px',
      fontWeight: 600,
      color: '#111827',
      whiteSpace: 'nowrap',
      lineHeight: '1.2',
    }}
  >
    Sem conta, sem senha: seus achados ficam salvos automaticamente neste aparelho
  </span>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className={`pop-btn header-nav-btn ${view === 'cart' ? 'active' : ''}`}
              onClick={() => {
                setView('cart');
                setAccountMenuOpen(false);
              }}
            >
              <CartIcon size={18} />
              <span className="nav-label">Carrinho</span>
              {cartIds.length > 0 && <span className="nav-badge">{cartIds.length}</span>}
            </button>

            <button
              type="button"
              className={`pop-btn header-nav-btn ${view === 'saved' ? 'active' : ''}`}
              onClick={() => {
                setView('saved');
                setAccountMenuOpen(false);
              }}
            >
              <BookmarkIcon size={18} filled={view === 'saved'} />
              <span className="nav-label">Salvos</span>
              {savedIds.length > 0 && <span className="nav-badge">{savedIds.length}</span>}
            </button>
            </div>
            {/* Rostinho / Conta ao lado de Salvos com menu suspenso */}
            <div className="account-menu-wrap" style={{ display: 'none' }} ref={accountMenuRef}>
              {!user ? (
                <button
                  type="button"
                  className="pop-btn header-account-btn"
                  onClick={() => openLogin('login')}
                  title="Entrar ou criar conta"
                  aria-label="Entrar na conta"
                >
                  <span className="account-avatar-circle guest">
                    <UserIcon size={15} />
                  </span>
                  <span className="nav-label">Entrar</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={`pop-btn header-account-btn logged ${accountMenuOpen ? 'open' : ''}`}
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  title={`Conta de ${user.name}`}
                  aria-expanded={accountMenuOpen}
                  aria-haspopup="menu"
                >
                  <span
                    className={`account-avatar-circle ${
                      user.provider === 'google' ? 'google-ring' : ''
                    }`}
                  >
                    {userInitial}
                  </span>
                  <span className="nav-label account-first-name">{userFirstName}</span>
                  <span className={`account-chevron ${accountMenuOpen ? 'rotated' : ''}`}>
                    <ChevronDownIcon size={14} />
                  </span>
                </button>
              )}

              {user && accountMenuOpen && (
                <div className="account-dropdown" role="menu">
                  <div className="account-dropdown-head">
                    <div
                      className={`account-avatar-circle lg ${
                        user.provider === 'google' ? 'google-ring' : ''
                      }`}
                    >
                      {userInitial}
                    </div>
                    <div className="account-dropdown-user">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                      {user.provider === 'google' && (
                        <span className="dropdown-provider-tag">
                          <GoogleIcon size={11} />
                          Google
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="account-dropdown-list">
                    <button
                      type="button"
                      className="account-dropdown-item"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setSettingsOpen(true);
                      }}
                    >
                      <SettingsIcon size={16} />
                      <span>Configurações da conta</span>
                    </button>

                    <button
                      type="button"
                      className="account-dropdown-item"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setView('saved');
                      }}
                    >
                      <BookmarkIcon size={16} />
                      <span>Meus salvos</span>
                      {savedIds.length > 0 && (
                        <span className="dropdown-count">{savedIds.length}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="account-dropdown-item"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setView('cart');
                      }}
                    >
                      <CartIcon size={16} />
                      <span>Meu carrinho</span>
                      {cartIds.length > 0 && (
                        <span className="dropdown-count">{cartIds.length}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="account-dropdown-item"
                      role="menuitem"
                      onClick={goToVisitedHistory}
                    >
                      <ClockIcon size={16} />
                      <span>Lojas visitadas</span>
                      {visitedLog.length > 0 && (
                        <span className="dropdown-count">{visitedLog.length}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="account-dropdown-item"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setLegalTab('termos');
                      }}
                    >
                      <ShieldIcon size={16} />
                      <span>Termos e Privacidade</span>
                    </button>
                  </div>

                  <div className="account-dropdown-foot">
                    <button
                      type="button"
                      className="account-dropdown-item danger"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOutIcon size={16} />
                      <span>Sair da conta</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="app-content-grow">
        {/* ==================== HOME ==================== */}
        {view === 'home' && (
          <>
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
                      <HeroSpotlightCard
                        key={product.id}
                        product={product}
                        inCart={cartIds.includes(product.id)}
                        isSaved={savedIds.includes(product.id)}
                        onToggleCart={toggleCart}
                        onToggleSave={toggleSave}
                        onOpenOffer={(p, idx) => setOfferModal({ product: p, imgIndex: idx })}
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

            <main className="main-container">
              <div className="simple-guide-bar">
                <p>Pesquise na busca acima ou escolha uma categoria abaixo</p>
                <span>
                  Procurando algo específico? Digite direto na barra "O que você quer comprar mais barato?".
                </span>
              </div>

              <section>
                <div className="categories-header-bar">
                  <span className="categories-accent-bar" />
                  <h2 className="categories-title">Categorias</h2>
                  <span className="categories-header-line" />
                  <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setSelectedNiches([]);
                setActiveQuery('');
                setSearchInput('');
                setView('search');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px 0',
                fontSize: '13px',
                fontWeight: 600,
                color: '#4b5563',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Todos os Produtos →
            </button>
                </div>

                <div className="categories-grid">
                  {allCategories.map((cat) => {
                    const count =
                      cat.name === 'Ofertas Relâmpago'
                        ? allProducts.length
                        : allProducts.filter((p) => p.category === cat.name).length;

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
<aside className={`sidebar-panel ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
              <button
                type="button"
                className="mobile-filter-trigger"
                onClick={() => setMobileFiltersOpen((prev) => !prev)}
              >
                <span>Filtros e ordenar</span>
                <span>{mobileFiltersOpen ? 'Fechar ▲' : 'Abrir ▼'}</span>
              </button>
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
                          onOpenZoom={(p, idx) => setOfferModal({ product: p, imgIndex: idx })}
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
                              <span className="store-signature">
                                <span className="store-dot-sm" style={{ background: best.color }} />
                                {best.name}
                              </span>
                              {savings > 0 && (
                                <span className="retail-diff-text">{formatDiffCompact(savings)}</span>
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
                  <div id="visited-history" style={{ marginTop: 28 }}>
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
                        const product = allProducts.find((p) => p.id === entry.productId);
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
                              <span className="store-signature">
                                <span className="store-dot-sm" style={{ background: best.color }} />
                                {best.name}
                              </span>
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
      </div>

      {/* ===== RODAPÉ COM TERMOS DE RESPONSABILIDADE ===== */}
      <LegalFooter onOpenLegal={(tab) => setLegalTab(tab)} />

      {/* ===== MODAL COMPLETO DE OFERTA (CARROSSEL + 5 LOJAS + COMPRAR) ===== */}
      {offerModal && (() => {
        const modalStores = getSortedStores(offerModal.product);
        const modalBest = modalStores[0];
        const modalOthers = modalStores.slice(1);
        const modalInCart = cartIds.includes(offerModal.product.id);
        const modalSaved = savedIds.includes(offerModal.product.id);

        return (
          <div className="modal-backdrop" onClick={() => setOfferModal(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  {offerModal.product.isOriginal && (
                    <span className="spotlight-original" style={{ marginBottom: 6 }}>
                      <VerifiedIcon size={13} />
                      Produto Original
                    </span>
                  )}
                  <h3 className="modal-title">{offerModal.product.title}</h3>
                </div>
                <button
                  type="button"
                  className="mini-pop-icon"
                  onClick={() => setOfferModal(null)}
                  aria-label="Fechar"
                >
                  <CloseIcon size={18} />
                </button>
              </div>

              <div className="modal-body-grid">
                <div>
                  <div className="modal-img-wrap">
                    <img
                      src={offerModal.product.images[offerModal.imgIndex]}
                      alt={offerModal.product.title}
                    />
                    {offerModal.product.images.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="media-nav-btn prev"
                          onClick={() =>
                            setOfferModal((prev) => ({
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
                            setOfferModal((prev) => ({
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

                  {offerModal.product.images.length > 1 && (
                    <div className="dots-row" style={{ justifyContent: 'center' }}>
                      {offerModal.product.images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`dot-btn ${idx === offerModal.imgIndex ? 'active' : ''}`}
                          onClick={() =>
                            setOfferModal((prev) => ({ ...prev, imgIndex: idx }))
                          }
                          aria-label={`Ver imagem ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-compare-col">
                  <a
                    href={modalBest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="retail-best-offer"
                    onClick={() => handleVisitStore(offerModal.product, modalBest)}
                  >
                    <div className="retail-best-meta">
                      <span className="retail-best-label">Menor preço verificado</span>
                      <span
                        className="store-tag-solid"
                        style={{ background: modalBest.color, color: modalBest.textColor }}
                      >
                        {modalBest.name}
                        <ArrowUpRightIcon size={12} />
                      </span>
                    </div>
                    <RetailPrice value={modalBest.price} size="lg" />
                  </a>

                  <div className="retail-compare-list">
                    {modalOthers.map((store) => {
                      const diff = store.price - modalBest.price;
                      return (
                        <a
                          key={store.name}
                          href={store.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="retail-compare-row"
                          onClick={() => handleVisitStore(offerModal.product, store)}
                        >
                          <span className="retail-compare-store">
                            <span className="store-dot-sm" style={{ background: store.color }} />
                            <span className="retail-compare-name">{store.name}</span>
                          </span>
                          <span className="retail-compare-numbers">
                            <span className="retail-compare-val">{formatBRL(store.price)}</span>
                            {diff > 0 && (
                              <span className="retail-diff-text">
                                {formatDiffCompact(diff)}
                              </span>
                            )}
                            <span className="row-hover-arrow">
                              <ArrowUpRightIcon size={12} />
                            </span>
                          </span>
                        </a>
                      );
                    })}
                  </div>

                  <div className="modal-actions-row">
                    <button
                      type="button"
                      className={`pop-btn card-cart-btn ${modalInCart ? 'active' : ''}`}
                      onClick={() => toggleCart(offerModal.product.id)}
                      title={modalInCart ? 'Remover do carrinho' : 'Guardar no carrinho'}
                    >
                      <CartIcon size={18} />
                    </button>

                    <button
                      type="button"
                      className={`pop-btn card-cart-btn ${modalSaved ? 'active' : ''}`}
                      onClick={() => toggleSave(offerModal.product.id)}
                      title={modalSaved ? 'Remover dos salvos' : 'Salvar oferta'}
                    >
                      <BookmarkIcon size={18} filled={modalSaved} />
                    </button>

                    <a
                      href={modalBest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pop-btn card-buy-btn"
                      onClick={() => handleVisitStore(offerModal.product, modalBest)}
                    >
                      Comprar na {modalBest.name}
                      <ExternalLinkIcon size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===== MODAL DE LOGIN / CADASTRO (RAIO DIAGONAL + FADE-IN BLUR) ===== */}
      <LoginModal
        isOpen={loginModalOpen}
        initialMode={loginInitialMode}
        onClose={() => setLoginModalOpen(false)}
        onAuthSuccess={(loggedUser) => setUser(loggedUser)}
        onOpenLegal={(tab) => setLegalTab(tab)}
      />

      {/* ===== MODAL DE CONFIGURAÇÕES DA CONTA ===== */}
      <AccountSettingsModal
        isOpen={settingsOpen}
        user={user}
        stats={{
          cartCount: cartIds.length,
          savedCount: savedIds.length,
          visitedCount: visitedLog.length,
        }}
        onClose={() => setSettingsOpen(false)}
        onUpdateUser={(updated) => setUser(updated)}
        onClearVisited={() => setVisitedLog([])}
        onClearLists={() => {
          setCartIds([]);
          setSavedIds([]);
        }}
        onDeleteAccount={handleDeleteAccount}
        onOpenLegal={(tab) => setLegalTab(tab)}
      />

      {/* ===== MODAL DE TERMOS, AFILIADOS E PRIVACIDADE (LGPD) ===== */}
      <LegalModal
        activeTab={legalTab}
        onChangeTab={(tab) => setLegalTab(tab)}
        onClose={() => setLegalTab(null)}
      />
      <nav className="mobile-app-nav" aria-label="Navegação do aplicativo">
        <button
          type="button"
          className={`mobile-app-nav-item ${view === 'home' ? 'active' : ''}`}
          onClick={() => {
            setView('home');
            setMobileFiltersOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <HomeIcon size={20} />
          <span>Início</span>
        </button>

        <button
          type="button"
          className={`mobile-app-nav-item ${view === 'search' ? 'active' : ''}`}
          onClick={() => {
            setMobileFiltersOpen(false);
            if (view !== 'home') {
              setView('home');
              setTimeout(() => {
                document
                  .querySelector('.categories-header-bar')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }, 80);
            } else {
              document
                .querySelector('.categories-header-bar')
                ?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          <span>Categorias</span>
        </button>

        <button
          type="button"
          className={`mobile-app-nav-item ${view === 'cart' ? 'active' : ''}`}
          onClick={() => {
            setView('cart');
            setMobileFiltersOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="mobile-app-icon-wrap">
            <CartIcon size={20} />
            {cartIds.length > 0 && (
              <span className="mobile-app-badge">{cartIds.length}</span>
            )}
          </span>
          <span>Carrinho</span>
        </button>

        <button
          type="button"
          className={`mobile-app-nav-item ${view === 'saved' ? 'active' : ''}`}
          onClick={() => {
            setView('saved');
            setMobileFiltersOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="mobile-app-icon-wrap">
            <BookmarkIcon size={20} filled={view === 'saved'} />
            {savedIds.length > 0 && (
              <span className="mobile-app-badge">{savedIds.length}</span>
            )}
          </span>
          <span>Salvos</span>
        </button>
      </nav>
    </div>
  );
}