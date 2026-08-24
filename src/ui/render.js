// @ts-check

import { getDecision } from '../domain/decisions.js';

/** @typedef {import('../application/controller.js').MutualManagerController} MutualManagerController */
/** @typedef {import('../infrastructure/storage.js').Appearance} Appearance */

/** @param {unknown} value */
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** @param {Appearance} appearance */
export function appearanceLabel(appearance) {
  if (appearance === 'light') return 'Claro';
  if (appearance === 'dark') return 'Escuro';
  return 'Sistema';
}

/** @param {Appearance} appearance @returns {Appearance} */
export function nextAppearance(appearance) {
  if (appearance === 'system') return 'light';
  if (appearance === 'light') return 'dark';
  return 'system';
}

/**
 * @param {MutualManagerController} controller
 * @param {{appearance: Appearance, followersFileName?: string, followingFileName?: string, notice?: string, error?: string}} ui
 */
export function renderApp(controller, ui) {
  const summary = controller.getSummary();
  const analyzed = Boolean(controller.analysis);
  const visible = controller.getVisibleProfiles();
  const counts = controller.getDecisionCounts();
  const activeTotal = controller.segment === 'not-following-back'
    ? summary.notFollowingBack
    : summary.notFollowedBack;

  return `
    <div class="cupertino-app-shell">
      <nav class="cupertino-navigation-bar">
        <div>
          <span class="eyebrow">LOCAL · PRIVADO</span>
          <h1>Instagram Mutual Manager</h1>
        </div>
        <button class="cupertino-text-button" type="button" data-action="appearance" aria-label="Alterar aparência">
          Aparência: ${appearanceLabel(ui.appearance)}
        </button>
      </nav>

      <section class="hero-section" aria-labelledby="hero-title">
        <span class="cupertino-symbol" aria-hidden="true">↔</span>
        <div>
          <h2 id="hero-title">Analise suas conexões sem entregar sua conta.</h2>
          <p>Importe os HTMLs oficiais do Instagram. O processamento acontece somente neste navegador e os arquivos brutos não são salvos.</p>
        </div>
      </section>

      ${ui.error ? `<div class="cupertino-alert error" role="alert">${escapeHtml(ui.error)}</div>` : ''}
      ${ui.notice ? `<div class="cupertino-alert success" role="status">${escapeHtml(ui.notice)}</div>` : ''}

      <section class="cupertino-group" aria-labelledby="import-title">
        <div class="group-heading">
          <div>
            <span class="eyebrow">IMPORTAÇÃO</span>
            <h2 id="import-title">Dados exportados</h2>
          </div>
          <span class="privacy-pill">Sem upload</span>
        </div>

        <div class="import-grid">
          ${renderFilePicker('followers', 'Seguidores', ui.followersFileName, controller.followersLoaded, summary.followers)}
          ${renderFilePicker('following', 'Seguindo', ui.followingFileName, controller.followingLoaded, summary.following)}
        </div>

        <button class="cupertino-primary-button" type="button" data-action="analyze" ${controller.canAnalyze() ? '' : 'disabled'}>
          Analisar conexões
        </button>
      </section>

      ${analyzed ? `
        <section class="stats-grid" aria-label="Resumo da análise">
          ${renderStat('Seguidores', summary.followers)}
          ${renderStat('Seguindo', summary.following)}
          ${renderStat('Mútuos', summary.mutual)}
          ${renderStat('Não seguem de volta', summary.notFollowingBack)}
        </section>

        <section class="cupertino-group results-group" aria-labelledby="results-title">
          <div class="group-heading results-heading">
            <div>
              <span class="eyebrow">RESULTADOS</span>
              <h2 id="results-title">Relações assimétricas</h2>
            </div>
            <button class="cupertino-text-button danger" type="button" data-action="clear-decisions">Limpar decisões</button>
          </div>

          <div class="cupertino-segmented-control" role="tablist" aria-label="Categoria de resultado">
            ${renderSegmentButton('not-following-back', 'Não me seguem', summary.notFollowingBack, controller.segment)}
            ${renderSegmentButton('not-followed-back', 'Não sigo de volta', summary.notFollowedBack, controller.segment)}
          </div>

          <div class="toolbar-grid">
            <label class="cupertino-search-field">
              <span aria-hidden="true">⌕</span>
              <input data-input="search" type="search" placeholder="Buscar username" value="${escapeHtml(controller.search)}" autocomplete="off" />
            </label>
            <label class="cupertino-select-field">
              <span>Decisão</span>
              <select data-input="decision-filter">
                ${renderFilterOption('all', 'Todos', controller.decisionFilter)}
                ${renderFilterOption('undecided', 'Indecisos', controller.decisionFilter)}
                ${renderFilterOption('keep', 'Manter', controller.decisionFilter)}
                ${renderFilterOption('remove', 'Remover', controller.decisionFilter)}
              </select>
            </label>
          </div>

          <div class="decision-summary" aria-label="Contagem de decisões">
            <span><i class="status-dot undecided"></i>Indecisos ${counts.undecided}</span>
            <span><i class="status-dot keep"></i>Manter ${counts.keep}</span>
            <span><i class="status-dot remove"></i>Remover ${counts.remove}</span>
          </div>

          <div class="list-meta">Mostrando ${visible.length} de ${activeTotal}</div>
          ${visible.length ? `<div class="cupertino-list">${visible.map((profile) => renderProfileRow(profile, getDecision(controller.decisions, profile.username))).join('')}</div>` : renderEmptyState()}
        </section>
      ` : renderInitialGuide()}

      <footer>
        <p>Processamento local · nenhum login · nenhuma API do Instagram</p>
      </footer>
    </div>
  `;
}

/** @param {string} kind @param {string} label @param {string=} fileName @param {boolean=} loaded @param {number=} count */
function renderFilePicker(kind, label, fileName = '', loaded = false, count = 0) {
  return `
    <label class="cupertino-file-picker ${loaded ? 'loaded' : ''}">
      <input data-file="${kind}" type="file" accept=".html,text/html" />
      <span class="file-icon" aria-hidden="true">${loaded ? '✓' : '⇧'}</span>
      <span class="file-copy">
        <strong>${label}</strong>
        <small>${loaded ? `${escapeHtml(fileName)} · ${count} perfis` : 'Selecionar arquivo HTML'}</small>
      </span>
      <span class="chevron" aria-hidden="true">›</span>
    </label>
  `;
}

/** @param {string} label @param {number} value */
function renderStat(label, value) {
  return `<article class="cupertino-stat"><span>${label}</span><strong>${value.toLocaleString('pt-BR')}</strong></article>`;
}

/** @param {string} value @param {string} label @param {number} count @param {string} active */
function renderSegmentButton(value, label, count, active) {
  const selected = value === active;
  return `<button type="button" role="tab" aria-selected="${selected}" data-segment="${value}" class="${selected ? 'active' : ''}">${label}<span>${count}</span></button>`;
}

/** @param {string} value @param {string} label @param {string} selected */
function renderFilterOption(value, label, selected) {
  return `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`;
}

/** @param {{username: string, profileUrl: string, followedAt?: string}} profile @param {'undecided'|'keep'|'remove'} decision */
export function renderProfileRow(profile, decision) {
  const username = escapeHtml(profile.username);
  const date = profile.followedAt ? `<small>${escapeHtml(profile.followedAt)}</small>` : '<small>Data não disponível</small>';
  return `
    <article class="cupertino-list-row" data-username="${username}">
      <div class="profile-avatar" aria-hidden="true">${escapeHtml(profile.username.slice(0, 1).toUpperCase())}</div>
      <div class="profile-copy">
        <strong>@${username}</strong>
        ${date}
      </div>
      <div class="decision-control" aria-label="Decisão para @${username}">
        ${renderDecisionButton(profile.username, 'keep', 'Manter', decision)}
        ${renderDecisionButton(profile.username, 'undecided', 'Indeciso', decision)}
        ${renderDecisionButton(profile.username, 'remove', 'Remover', decision)}
      </div>
      <a class="profile-link" href="${escapeHtml(profile.profileUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir @${username} no Instagram">↗</a>
    </article>
  `;
}

/** @param {string} username @param {'undecided'|'keep'|'remove'} value @param {string} label @param {'undecided'|'keep'|'remove'} selected */
function renderDecisionButton(username, value, label, selected) {
  return `<button type="button" data-decision="${value}" data-username="${escapeHtml(username)}" class="decision-${value} ${selected === value ? 'selected' : ''}" aria-pressed="${selected === value}">${label}</button>`;
}

function renderEmptyState() {
  return `<div class="empty-state"><span aria-hidden="true">⌕</span><strong>Nenhum perfil encontrado</strong><p>Ajuste a busca ou o filtro de decisão.</p></div>`;
}

function renderInitialGuide() {
  return `
    <section class="cupertino-group guide-group" aria-labelledby="guide-title">
      <span class="eyebrow">COMO FUNCIONA</span>
      <h2 id="guide-title">Três passos, sem autenticação</h2>
      <ol class="cupertino-list numbered-list">
        <li><span>1</span><div><strong>Exporte seus dados</strong><small>Solicite ao Instagram os HTMLs de seguidores e seguindo.</small></div></li>
        <li><span>2</span><div><strong>Importe os dois arquivos</strong><small>Eles são lidos localmente e nunca são enviados para um servidor.</small></div></li>
        <li><span>3</span><div><strong>Classifique seus resultados</strong><small>Marque perfis como manter, indeciso ou remover.</small></div></li>
      </ol>
    </section>
  `;
}
