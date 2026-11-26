import React, { useEffect, useState } from 'react';
import {
  BoltIcon,
  CheckIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  GiraeLogo,
  GoogleIcon,
  SettingsIcon,
  ShieldIcon,
  TrashIcon,
  UserIcon,
} from './Icons';

/* ===== MODAL DE LOGIN / CADASTRO COM RAIO DIAGONAL CARTOON + FADE-IN BLUR ===== */
export function LoginModal({
  isOpen,
  initialMode = 'login',
  onClose,
  onAuthSuccess,
  onOpenLegal,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg('');
      setInfoMsg('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    const cleanId = identifier.trim();

    if (mode === 'forgot') {
      if (!cleanId || !cleanId.includes('@')) {
        setErrorMsg('Digite um e-mail válido para recuperar sua senha.');
        return;
      }
      setInfoMsg(
        `Se existir uma conta com ${cleanId}, enviaremos um link de redefinição em instantes.`
      );
      return;
    }

    if (mode === 'register') {
      if (name.trim().length < 2) {
        setErrorMsg('Informe seu nome (mínimo de 2 letras).');
        return;
      }
      if (!cleanId.includes('@') || !cleanId.includes('.')) {
        setErrorMsg('Digite um endereço de e-mail válido.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Crie uma senha com pelo menos 6 caracteres.');
        return;
      }

      onAuthSuccess({
        name: name.trim(),
        email: cleanId.toLowerCase(),
        provider: 'email',
        createdAt: new Date().toLocaleDateString('pt-BR'),
      });
      setName('');
      setIdentifier('');
      setPassword('');
      onClose();
      return;
    }

    // Login padrão (usuário ou e-mail + senha)
    if (!cleanId) {
      setErrorMsg('Digite seu usuário ou e-mail.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Digite sua senha (mínimo de 6 caracteres).');
      return;
    }

    const derivedName = cleanId.includes('@')
      ? cleanId.split('@')[0].replace(/[._-]+/g, ' ')
      : cleanId;
    const formattedName = derivedName
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    onAuthSuccess({
      name: formattedName || 'Usuário GIRAE',
      email: cleanId.includes('@') ? cleanId.toLowerCase() : `${cleanId.toLowerCase()}@girae.app`,
      provider: 'email',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    });
    setIdentifier('');
    setPassword('');
    onClose();
  };

  const handleGoogleLogin = () => {
    onAuthSuccess({
      name: 'Conta Google',
      email: 'voce@gmail.com',
      provider: 'google',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    });
    onClose();
  };

  return (
    <div className="auth-stage-backdrop" onClick={onClose}>
      {/* Camada de fundo: Raio diagonal cartoon (superior esq. -> inferior dir.) + fade-in blur suave */}
      <div className="auth-bolt-bg" aria-hidden="true">
        <svg
          className="auth-diagonal-bolt-svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="-60,-40 240,-40 720,410 880,350 1500,940 1200,940 690,490 540,545"
            fill="#111111"
            transform="translate(14, 16)"
            opacity="0.45"
          />
          <polygon
            points="-60,-40 240,-40 720,410 880,350 1500,940 1200,940 690,490 540,545"
            fill="#FFD400"
            stroke="#111111"
            strokeWidth="18"
            strokeLinejoin="round"
          />
          <polyline
            points="70,15 585,435"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.55"
          />
          <polyline
            points="840,445 1350,880"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      </div>

      {/* Camada de suavização para o amarelo nunca incomodar os olhos */}
      <div className="auth-soft-veil" aria-hidden="true" />

      {/* Card sólido e 100% nítido no centro da tela */}
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="mini-pop-icon auth-close-btn"
          onClick={onClose}
          aria-label="Fechar login"
        >
          <CloseIcon size={17} />
        </button>

        {/* Topo do rascunho: GIRAE | ⚡ Login */}
        <div className="auth-brand-header">
          <GiraeLogo height={34} variant="onYellow" />
          <span className="auth-brand-divider" aria-hidden="true" />
          <span className="auth-mode-badge">
            <BoltIcon size={14} />
            {mode === 'login' && 'Login'}
            {mode === 'register' && 'Cadastro'}
            {mode === 'forgot' && 'Recuperar'}
          </span>
        </div>

        <p className="auth-subtitle">
          {mode === 'login' &&
            'Entre para sincronizar seu carrinho, ofertas salvas e histórico de lojas.'}
          {mode === 'register' &&
            'Crie sua conta grátis em segundos — sem CPF e sem dados bancários.'}
          {mode === 'forgot' &&
            'Informe o e-mail da sua conta para receber as instruções de nova senha.'}
        </p>

        {errorMsg && <div className="auth-alert auth-alert-error">{errorMsg}</div>}
        {infoMsg && <div className="auth-alert auth-alert-info">{infoMsg}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Seu nome</label>
              <input
                id="auth-name"
                type="text"
                className="auth-pill-input"
                placeholder="Como quer ser chamado"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-id">
              {mode === 'login' ? 'Usuário ou e-mail' : 'E-mail'}
            </label>
            <input
              id="auth-id"
              type={mode === 'login' ? 'text' : 'email'}
              className="auth-pill-input"
              placeholder={
                mode === 'login' ? 'Digite seu usuário ou e-mail' : 'seuemail@exemplo.com'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="email"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="auth-pass">Senha</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="auth-text-link"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                      setInfoMsg('');
                    }}
                  >
                    Esqueci minha senha
                  </button>
                )}
              </div>

              <div className="auth-pass-wrap">
                <input
                  id="auth-pass"
                  type={showPassword ? 'text' : 'password'}
                  className="auth-pill-input auth-pass-input"
                  placeholder={
                    mode === 'register' ? 'Mínimo de 6 caracteres' : 'Digite sua senha'
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="pop-btn auth-submit-btn">
            {mode === 'login' && 'Entrar'}
            {mode === 'register' && 'Criar conta grátis'}
            {mode === 'forgot' && 'Enviar link de recuperação'}
          </button>
        </form>

        {/* Linha divisória do rascunho separando Cadastro / Acesso Google */}
        <div className="auth-divider-line">
          <span>ou</span>
        </div>

        <div className="auth-alt-actions">
          <button
            type="button"
            className="pop-btn auth-google-btn"
            onClick={handleGoogleLogin}
          >
            <GoogleIcon size={18} />
            <span>Continuar com o Google</span>
          </button>

          {mode === 'login' ? (
            <button
              type="button"
              className="pop-btn auth-secondary-btn"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
                setInfoMsg('');
              }}
            >
              Criar cadastro com e-mail
            </button>
          ) : (
            <button
              type="button"
              className="pop-btn auth-secondary-btn"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
                setInfoMsg('');
              }}
            >
              Já tenho conta — Voltar ao Login
            </button>
          )}
        </div>

        <p className="auth-legal-foot">
          Ao continuar, você concorda com os{' '}
          <button
            type="button"
            className="auth-inline-legal"
            onClick={() => onOpenLegal('termos')}
          >
            Termos de Responsabilidade
          </button>{' '}
          e a{' '}
          <button
            type="button"
            className="auth-inline-legal"
            onClick={() => onOpenLegal('privacidade')}
          >
            Política de Privacidade
          </button>
          .
        </p>
      </div>
    </div>
  );
}

/* ===== MODAL COMPLETO DE CONFIGURAÇÕES DA CONTA (PERFIL, SEGURANÇA E DADOS LGPD) ===== */
export function AccountSettingsModal({
  isOpen,
  user,
  stats,
  onClose,
  onUpdateUser,
  onClearVisited,
  onClearLists,
  onDeleteAccount,
  onOpenLegal,
}) {
  const [activeTab, setActiveTab] = useState('perfil'); // 'perfil' | 'seguranca' | 'dados'
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.name || '');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setFeedback(null);
      setConfirmDelete(false);
    }
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const userInitial = (user.name || 'U').trim().charAt(0).toUpperCase();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const cleaned = displayName.trim();
    if (cleaned.length < 2) {
      setFeedback({ type: 'error', text: 'Seu nome precisa ter pelo menos 2 letras.' });
      return;
    }
    onUpdateUser({ ...user, name: cleaned });
    setFeedback({ type: 'success', text: 'Nome de exibição atualizado com sucesso.' });
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (currentPass.length < 6) {
      setFeedback({ type: 'error', text: 'Digite sua senha atual.' });
      return;
    }
    if (newPass.length < 6) {
      setFeedback({ type: 'error', text: 'A nova senha precisa ter no mínimo 6 caracteres.' });
      return;
    }
    if (newPass !== confirmPass) {
      setFeedback({ type: 'error', text: 'A confirmação da nova senha não confere.' });
      return;
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setFeedback({ type: 'success', text: 'Senha alterada com sucesso.' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box settings-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="settings-header-title">
            <span className="settings-icon-badge">
              <SettingsIcon size={17} />
            </span>
            <div>
              <h3 className="modal-title">Configurações da Conta</h3>
              <p className="settings-header-sub">
                Gerencie seu perfil, acesso e privacidade na GIRAE
              </p>
            </div>
          </div>
          <button
            type="button"
            className="mini-pop-icon"
            onClick={onClose}
            aria-label="Fechar configurações"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="legal-tabs-row">
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('perfil');
              setFeedback(null);
            }}
          >
            <UserIcon size={14} />
            Perfil
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'seguranca' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('seguranca');
              setFeedback(null);
            }}
          >
            <ShieldIcon size={14} />
            Segurança
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'dados' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('dados');
              setFeedback(null);
            }}
          >
            <TrashIcon size={14} />
            Dados e Privacidade
          </button>
        </div>

        {feedback && (
          <div
            className={`auth-alert ${
              feedback.type === 'error' ? 'auth-alert-error' : 'auth-alert-success'
            }`}
          >
            {feedback.type === 'success' && <CheckIcon size={15} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {activeTab === 'perfil' && (
          <form className="settings-section" onSubmit={handleSaveProfile}>
            <div className="settings-profile-banner">
              <div className="settings-avatar-lg">{userInitial}</div>
              <div className="settings-profile-meta">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <span className="provider-chip">
                  {user.provider === 'google' ? (
                    <>
                      <GoogleIcon size={12} />
                      Conectado com Google
                    </>
                  ) : (
                    <>Conta com e-mail e senha</>
                  )}
                </span>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="settings-name">Nome de exibição</label>
              <input
                id="settings-name"
                type="text"
                className="auth-pill-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="settings-email">E-mail cadastrado</label>
              <input
                id="settings-email"
                type="email"
                className="auth-pill-input"
                value={user.email}
                disabled
              />
            </div>

            <div className="settings-save-row">
              <button
                type="submit"
                className="pop-btn btn-action-sm"
                style={{ background: 'var(--girae-yellow)' }}
              >
                Salvar alterações
              </button>
            </div>
          </form>
        )}

        {activeTab === 'seguranca' && (
          <div className="settings-section">
            {user.provider === 'google' ? (
              <div className="settings-info-card">
                <GoogleIcon size={22} />
                <div>
                  <h4>Acesso protegido pelo Google</h4>
                  <p>
                    Você entrou usando sua conta Google. Sua senha e verificação de segurança
                    são gerenciadas diretamente nas configurações da sua Conta Google.
                  </p>
                </div>
              </div>
            ) : (
              <form className="settings-pass-form" onSubmit={handleSavePassword}>
                <div className="auth-field">
                  <label htmlFor="pass-current">Senha atual</label>
                  <input
                    id="pass-current"
                    type="password"
                    className="auth-pill-input"
                    placeholder="Digite sua senha atual"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="pass-new">Nova senha</label>
                  <input
                    id="pass-new"
                    type="password"
                    className="auth-pill-input"
                    placeholder="Mínimo de 6 caracteres"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="pass-confirm">Confirmar nova senha</label>
                  <input
                    id="pass-confirm"
                    type="password"
                    className="auth-pill-input"
                    placeholder="Repita a nova senha"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>
                <div className="settings-save-row">
                  <button
                    type="submit"
                    className="pop-btn btn-action-sm"
                    style={{ background: 'var(--girae-yellow)' }}
                  >
                    Atualizar senha
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'dados' && (
          <div className="settings-section">
            <div className="settings-stats-grid">
              <div className="settings-stat-box">
                <span>No carrinho</span>
                <strong>{stats.cartCount}</strong>
              </div>
              <div className="settings-stat-box">
                <span>Salvos</span>
                <strong>{stats.savedCount}</strong>
              </div>
              <div className="settings-stat-box">
                <span>Lojas visitadas</span>
                <strong>{stats.visitedCount}</strong>
              </div>
            </div>

            <div className="settings-action-list">
              <div className="settings-action-row">
                <div>
                  <strong>Histórico de lojas visitadas</strong>
                  <p>Remove o registro recente das lojas externas que você clicou.</p>
                </div>
                <button
                  type="button"
                  className="pop-btn btn-action-sm"
                  onClick={() => {
                    onClearVisited();
                    setFeedback({
                      type: 'success',
                      text: 'Histórico de lojas visitadas limpo.',
                    });
                  }}
                >
                  Limpar histórico
                </button>
              </div>

              <div className="settings-action-row">
                <div>
                  <strong>Zerar carrinho e salvos</strong>
                  <p>Remove todos os produtos guardados nas suas listas atuais.</p>
                </div>
                <button
                  type="button"
                  className="pop-btn btn-action-sm"
                  onClick={() => {
                    onClearLists();
                    setFeedback({
                      type: 'success',
                      text: 'Carrinho e lista de salvos esvaziados.',
                    });
                  }}
                >
                  Limpar listas
                </button>
              </div>

              <div className="settings-action-row">
                <div>
                  <strong>Termos e Política LGPD</strong>
                  <p>Consulte a qualquer momento como a GIRAE protege sua privacidade.</p>
                </div>
                <button
                  type="button"
                  className="pop-btn btn-action-sm"
                  onClick={() => {
                    onClose();
                    onOpenLegal('privacidade');
                  }}
                >
                  Ler política
                </button>
              </div>
            </div>

            <div className="settings-danger-zone">
              <div>
                <strong>Excluir minha conta (LGPD)</strong>
                <p>
                  Remove seu cadastro e desconecta seus dados salvos neste navegador. Essa
                  ação não pode ser desfeita.
                </p>
              </div>

              {!confirmDelete ? (
                <button
                  type="button"
                  className="pop-btn btn-action-sm settings-danger-btn"
                  onClick={() => setConfirmDelete(true)}
                >
                  Excluir conta
                </button>
              ) : (
                <div className="settings-confirm-row">
                  <button
                    type="button"
                    className="pop-btn btn-action-sm"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="pop-btn btn-action-sm settings-danger-confirm"
                    onClick={onDeleteAccount}
                  >
                    Confirmar exclusão
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}