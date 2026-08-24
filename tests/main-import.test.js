import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrap } from '../src/main.js';

test('browser entry module is safe to import without a DOM', () => {
  assert.equal(typeof bootstrap, 'function');
});
