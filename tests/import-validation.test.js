import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_IMPORT_BYTES, validateImportFileMetadata } from '../src/application/import-validation.js';

test('accepts normal HTML metadata', () => {
  assert.deepEqual(validateImportFileMetadata({ name: 'followers.html', size: 100, type: 'text/html' }), { ok: true });
  assert.deepEqual(validateImportFileMetadata({ name: 'followers.HTML', size: 100, type: '' }), { ok: true });
});

test('rejects wrong extension, empty, oversized, and conflicting MIME', () => {
  assert.equal(validateImportFileMetadata({ name: 'followers.json', size: 100 }).ok, false);
  assert.equal(validateImportFileMetadata({ name: 'followers.html', size: 0 }).ok, false);
  assert.equal(validateImportFileMetadata({ name: 'followers.html', size: MAX_IMPORT_BYTES + 1 }).ok, false);
  assert.equal(validateImportFileMetadata({ name: 'followers.html', size: 100, type: 'application/json' }).ok, false);
});
