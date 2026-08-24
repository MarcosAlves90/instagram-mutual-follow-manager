import test from 'node:test';
import assert from 'node:assert/strict';
import { DecisionRepository, PreferencesRepository } from '../src/infrastructure/storage.js';
import { MemoryStorage } from './helpers.js';

test('stores decisions per dataset and filters invalid persisted values', () => {
  const storage = new MemoryStorage();
  const repo = new DecisionRepository(storage);
  repo.save('dataset-a', { alice: 'keep', bob: 'remove' });
  assert.deepEqual(repo.load('dataset-a'), { alice: 'keep', bob: 'remove' });
  assert.deepEqual(repo.load('dataset-b'), {});
  storage.setItem('ig-mutual-manager:v2:decisions:bad', JSON.stringify({ a: 'later', b: 'undecided', c: 'keep' }));
  assert.deepEqual(repo.load('bad'), { c: 'keep' });
  storage.setItem('ig-mutual-manager:v2:decisions:broken', '{');
  assert.deepEqual(repo.load('broken'), {});
  repo.clear('dataset-a');
  assert.deepEqual(repo.load('dataset-a'), {});
});

test('handles malformed decision containers', () => {
  const storage = new MemoryStorage({
    'ig-mutual-manager:v2:decisions:array': '[]',
    'ig-mutual-manager:v2:decisions:null': 'null',
  });
  const repo = new DecisionRepository(storage);
  assert.deepEqual(repo.load('array'), {});
  assert.deepEqual(repo.load('null'), {});
});

test('persists Cupertino appearance preference', () => {
  const storage = new MemoryStorage();
  const repo = new PreferencesRepository(storage);
  assert.equal(repo.loadAppearance(), 'system');
  repo.saveAppearance('dark');
  assert.equal(repo.loadAppearance(), 'dark');
  storage.setItem('ig-mutual-manager:v2:appearance', 'unknown');
  assert.equal(repo.loadAppearance(), 'system');
});
