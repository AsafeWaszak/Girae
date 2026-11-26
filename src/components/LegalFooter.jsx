import React from 'react';
import { CloseIcon, GiraeLogo, ShieldIcon, VerifiedIcon } from './Icons';

export function LegalFooter({ onOpenLegal }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <GiraeLogo height={36} variant="onDark" />
          <p className="footer-tagline">
            Comparador de preços e curadoria independente. Pesquisamos nas maiores lojas
            do Brasil para você economizar de verdade.
          </p>
        </div>

        <div className="footer-links-col">
          <div className="footer-col-title">Transparência e Legal</div>
          <div className="footer-links-list">
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => onOpenLegal('termos')}
            >
              Termos de Responsabilidade
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => onOpenLegal('afiliados')}
            >
              Divulgação de Afiliados
            </button>
            <button
              type="button"
              className="footer-link-btn"
              onClick={() => onOpenLegal('privacidade')}
            >
              Política de Privacidade (LGPD)
            </button>
          </div>
        </div>
      </div>

      <div className="footer-disclaimer-bar">
        <div className="footer-disclaimer-inner">
          <p>
            <strong>Aviso importante:</strong> A GIRAE atua exclusivamente como comparador
            de preços e curadoria de ofertas. Não comercializamos produtos diretamente nem
            processamos pagamentos. Preços, frete e disponibilidade podem variar sem aviso
            prévio na loja parceira escolhida.
          </p>
          <span className="footer-copy">© 2026 GIRAE — Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}

export function LegalModal({ activeTab, onChangeTab, onClose }) {
  if (!activeTab) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box legal-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="legal-modal-heading">
            <span className="legal-badge-pill">
              <ShieldIcon size={14} />
              Transparência GIRAE
            </span>
            <h3 className="modal-title">Termos de Responsabilidade e Privacidade</h3>
          </div>
          <button
            type="button"
            className="mini-pop-icon"
            onClick={onClose}
            aria-label="Fechar termos"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="legal-tabs-row">
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'termos' ? 'active' : ''}`}
            onClick={() => onChangeTab('termos')}
          >
            Termos de Responsabilidade
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'afiliados' ? 'active' : ''}`}
            onClick={() => onChangeTab('afiliados')}
          >
            Divulgação de Afiliados
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeTab === 'privacidade' ? 'active' : ''}`}
            onClick={() => onChangeTab('privacidade')}
          >
            Privacidade (LGPD)
          </button>
        </div>

        <div className="legal-content-scroll">
          {activeTab === 'termos' && (
            <div className="legal-doc-section">
              <h4>1. Natureza do Serviço</h4>
              <p>
                A <strong>GIRAE</strong> é uma plataforma gratuita de comparação de preços e
                curadoria de ofertas de grandes varejistas online. Nós não vendemos produtos
                diretamente, não possuímos estoque próprio e não intermediamos pagamentos ou
                entregas.
              </p>

              <h4>2. Variação de Preços e Disponibilidade</h4>
              <p>
                Os valores, descontos e estoques exibidos na GIRAE são pesquisados e
                atualizados periodicamente, mas as lojas parceiras podem alterar preços,
                condições de frete ou encerrar promoções a qualquer momento sem aviso prévio.
                <strong>
                  {' '}
                  Em caso de divergência, prevalece sempre o preço exibido no carrinho final
                  da loja oficial.
                </strong>
              </p>

              <h4>3. Compra, Entrega, Garantia e Trocas</h4>
              <p>
                Ao clicar em <strong>Comprar</strong> ou em qualquer oferta, você é
                redirecionado para o ambiente oficial da loja selecionada (como Mercado
                Livre, Amazon, Magalu, KaBuM! ou Loja Oficial). Todo o processo de pagamento,
                emissão de nota fiscal, envio, garantia e direito de arrependimento (CDC) é
                de responsabilidade exclusiva da loja onde a compra foi concluída.
              </p>

              <h4>4. Marcas e Direitos de Terceiros</h4>
              <p>
                Os nomes das lojas exibidos na comparação são utilizados exclusivamente com
                finalidade informativa para indicar onde o menor preço foi localizado, sem
                vínculo societário, representação oficial ou endosso direto por parte dessas
                marcas.
              </p>
            </div>
          )}

          {activeTab === 'afiliados' && (
            <div className="legal-doc-section">
              <div className="legal-highlight-box">
                <VerifiedIcon size={16} />
                <span>
                  Você <strong>nunca paga nada a mais</strong> por usar os links da GIRAE.
                </span>
              </div>

              <h4>Como a GIRAE se mantém gratuita?</h4>
              <p>
                A GIRAE participa de programas oficiais de afiliados de grandes varejistas do
                mercado (incluindo, entre outros, Amazon Associados, Programa de Afiliados
                Mercado Livre e parceiros varejistas verificados).
              </p>

              <h4>Independência na ordem dos preços</h4>
              <p>
                Quando você clica em uma oferta e finaliza uma compra na loja parceira, a
                GIRAE pode receber uma pequena comissão paga pela própria loja — sem qualquer
                acréscimo no valor do produto para você. O destaque de <strong>Menor Preço</strong>{' '}
                segue sempre o critério objetivo do valor mais baixo verificado no momento da
                curadoria.
              </p>
            </div>
          )}

          {activeTab === 'privacidade' && (
            <div className="legal-doc-section">
              <h4>1. Quais dados coletamos (LGPD — Lei nº 13.709/2018)</h4>
              <p>
                Você pode pesquisar e comparar preços na GIRAE sem criar conta. Caso opte por
                fazer login, armazenamos apenas o mínimo necessário para sua experiência:
                <strong> nome de exibição, endereço de e-mail</strong> e suas preferências
                dentro do site (itens no carrinho, ofertas salvas e histórico recente de
                lojas visitadas).
              </p>

              <h4>2. O que NUNCA pedimos</h4>
              <p>
                A GIRAE <strong>nunca solicita</strong> CPF, dados de cartão de crédito,
                senhas bancárias ou endereço residencial. Caso receba qualquer mensagem
                pedindo esses dados em nosso nome, desconsidere imediatamente.
              </p>

              <h4>3. Seus direitos sobre os dados</h4>
              <p>
                Você tem controle total sobre sua conta: a qualquer momento pode editar seu
                nome, limpar seu histórico de lojas visitadas ou{' '}
                <strong>excluir sua conta e todos os dados vinculados</strong> diretamente na
                aba <strong>Configurações da Conta</strong>.
              </p>
            </div>
          )}
        </div>

        <div className="legal-modal-footer">
          <span className="legal-updated-note">Última atualização: Novembro de 2026</span>
          <button
            type="button"
            className="pop-btn btn-action-sm"
            style={{ background: 'var(--girae-yellow)' }}
            onClick={onClose}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}