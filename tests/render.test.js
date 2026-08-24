import test from 'node:test';
import assert from 'node:assert/strict';
import { MutualManagerController } from '../src/application/controller.js';
import { appearanceLabel, escapeHtml, nextAppearance, renderApp, renderProfileRow } from '../src/ui/render.js';

class DecisionRepo {
  load() { return {}; }
  save() {}
  clear() {}
}

test('escapes untrusted text and cycles appearance', () => {
  assert.equal(escapeHtml('<b>"x" & y</b>'), '&lt;b&gt;&quot;x&quot; &amp; y&lt;/b&gt;');
  assert.equal(appearanceLabel('system'), 'Sistema');
  assert.equal(appearanceLabel('light'), 'Claro');
  assert.equal(appearanceLabel('dark'), 'Escuro');
  assert.equal(nextAppearance('system'), 'light');
  assert.equal(nextAppearance('light'), 'dark');
  assert.equal(nextAppearance('dark'), 'system');
});

test('renders profile row with canonical link and escaped content', () => {
  const html = renderProfileRow({
    username: 'alice<script>',
    profileUrl: 'https://www.instagram.com/alice/',
    followedAt: '<today>',
  }, 'remove');
  assert.match(html, /alice&lt;script&gt;/);
  assert.match(html, /&lt;today&gt;/);
  assert.match(html, /decision-remove selected/);
  assert.match(html, /noopener noreferrer/);
});

test('renders initial Cupertino import state', () => {
  const controller = new MutualManagerController(new DecisionRepo());
  const html = renderApp(controller, { appearance: 'system' });
  assert.match(html, /Instagram Mutual Manager/);
  assert.match(html, /cupertino-file-picker/);
  assert.match(html, /cupertino-primary-button/);
  assert.match(html, /disabled/);
  assert.match(html, /Três passos/);
});

test('renders analyzed results, active segment, filters and notices', async () => {
  const controller = new MutualManagerController(new DecisionRepo());
  controller.importFollowers(`
    <a href="https://www.instagram.com/alice/">alice</a>
    <a href="https://www.instagram.com/shared/">shared</a>
  `);
  controller.importFollowing(`
    <a href="https://www.instagram.com/bob/">bob</a>
    <a href="https://www.instagram.com/shared/">shared</a>
  `);
  await controller.analyze();
  controller.updateDecision('bob', 'keep');
  const html = renderApp(controller, {
    appearance: 'dark',
    followersFileName: 'followers.html',
    followingFileName: 'following.html',
    notice: 'ok',
    error: 'sample error',
  });
  assert.match(html, /Aparência: Escuro/);
  assert.match(html, /followers\.html · 2 perfis/);
  assert.match(html, /Não me seguem/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /@bob/);
  assert.match(html, /Manter 1/);
  assert.match(html, /sample error/);
  assert.match(html, />ok</);

  controller.setSearch('nothing');
  assert.match(renderApp(controller, { appearance: 'light' }), /Nenhum perfil encontrado/);
});
