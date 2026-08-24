// @ts-check

import { MutualManagerController } from './application/controller.js';
import { validateImportFileMetadata } from './application/import-validation.js';
import { DecisionRepository, PreferencesRepository } from './infrastructure/storage.js';
import { nextAppearance, renderApp } from './ui/render.js';

/**
 * Mount the browser application. Kept behind one function so importing the module in non-DOM validation environments is safe.
 * @param {Document} documentRef
 * @param {Storage} storage
 */
export function bootstrap(documentRef, storage) {
  const rootCandidate = documentRef.querySelector('#app');
  if (!(rootCandidate instanceof HTMLElement)) throw new Error('Application root not found.');
  const root = rootCandidate;

  const decisionRepository = new DecisionRepository(storage);
  const preferencesRepository = new PreferencesRepository(storage);
  const controller = new MutualManagerController(decisionRepository);
  const ui = {
    appearance: preferencesRepository.loadAppearance(),
    followersFileName: '',
    followingFileName: '',
    notice: '',
    error: '',
  };

  applyAppearance();
  render();

  root.addEventListener('change', async (event) => {
    const target = event.target;

    if (target instanceof HTMLInputElement && target.dataset.file) {
      const file = target.files?.[0];
      if (!file) return;
      const validation = validateImportFileMetadata(file);
      if (!validation.ok) return showError(validation.message);

      try {
        const content = await file.text();
        if (target.dataset.file === 'followers') {
          controller.importFollowers(content);
          ui.followersFileName = file.name;
        } else {
          controller.importFollowing(content);
          ui.followingFileName = file.name;
        }
        ui.error = '';
        ui.notice = `${file.name} carregado localmente.`;
        render();
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Não foi possível ler o arquivo.');
      }
      return;
    }

    if (target instanceof HTMLSelectElement && target.dataset.input === 'decision-filter') {
      const filter = target.value;
      if (filter === 'all' || filter === 'undecided' || filter === 'keep' || filter === 'remove') {
        controller.setDecisionFilter(filter);
        render();
      }
    }
  });

  root.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.dataset.input === 'search') {
      controller.setSearch(target.value);
      render();
      const search = root.querySelector('[data-input="search"]');
      if (search instanceof HTMLInputElement) {
        search.focus();
        search.setSelectionRange(search.value.length, search.value.length);
      }
    }
  });

  root.addEventListener('click', async (event) => {
    const target = event.target instanceof Element ? event.target.closest('button') : null;
    if (!(target instanceof HTMLButtonElement)) return;

    if (target.dataset.action === 'appearance') {
      ui.appearance = nextAppearance(ui.appearance);
      preferencesRepository.saveAppearance(ui.appearance);
      applyAppearance();
      render();
      return;
    }

    if (target.dataset.action === 'analyze') {
      try {
        await controller.analyze();
        ui.notice = 'Análise concluída.';
        ui.error = '';
        render();
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Não foi possível analisar os arquivos.');
      }
      return;
    }

    if (target.dataset.action === 'clear-decisions') {
      controller.clearDecisions();
      ui.notice = 'Decisões locais removidas para este conjunto de dados.';
      render();
      return;
    }

    if (target.dataset.segment === 'not-following-back' || target.dataset.segment === 'not-followed-back') {
      controller.setSegment(target.dataset.segment);
      render();
      return;
    }

    const decision = target.dataset.decision;
    const username = target.dataset.username;
    if (username && (decision === 'undecided' || decision === 'keep' || decision === 'remove')) {
      controller.updateDecision(username, decision);
      ui.notice = `Decisão de @${username} salva neste navegador.`;
      render();
    }
  });

  function render() {
    root.innerHTML = renderApp(controller, ui);
  }

  function applyAppearance() {
    documentRef.documentElement.dataset.theme = ui.appearance;
  }

  /** @param {string} message */
  function showError(message) {
    ui.error = message;
    ui.notice = '';
    render();
  }
}

if (typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
  bootstrap(document, localStorage);
}
