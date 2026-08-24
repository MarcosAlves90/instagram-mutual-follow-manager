import test from 'node:test';
import assert from 'node:assert/strict';
import { createDatasetId } from '../src/application/dataset.js';

const p = (username) => ({ username, profileUrl: `https://www.instagram.com/${username}/` });

test('dataset identity is deterministic, order-independent and relation-sensitive', async () => {
  const first = await createDatasetId([p('alice'), p('bob')], [p('carol')]);
  const reordered = await createDatasetId([p('bob'), p('alice')], [p('carol')]);
  const swapped = await createDatasetId([p('carol')], [p('alice'), p('bob')]);
  assert.equal(first, reordered);
  assert.notEqual(first, swapped);
  assert.match(first, /^[a-f0-9]{24}$/);
});

test('dataset identity fails closed without Web Crypto', async () => {
  await assert.rejects(() => createDatasetId([], [], /** @type {Crypto} */ ({})), /Web Crypto/);
});
