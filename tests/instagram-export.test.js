import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeHtmlEntities,
  extractNearbyDate,
  isValidUsername,
  parseInstagramExport,
  profileFromInstagramHref,
} from '../src/infrastructure/instagram-export.js';

test('accepts only canonical HTTPS Instagram profile links', () => {
  assert.deepEqual(profileFromInstagramHref('https://www.instagram.com/_u/Alice/?x=1'), {
    username: 'alice',
    profileUrl: 'https://www.instagram.com/alice/',
  });
  assert.equal(profileFromInstagramHref('http://www.instagram.com/alice/'), null);
  assert.equal(profileFromInstagramHref('https://evil.example/instagram.com/alice'), null);
  assert.equal(profileFromInstagramHref('https://www.instagram.com/p/abc'), null);
  assert.equal(profileFromInstagramHref('not a url'), null);
});

test('validates username syntax', () => {
  assert.equal(isValidUsername('valid.user_1'), true);
  assert.equal(isValidUsername('.invalid'), false);
  assert.equal(isValidUsername('invalid.'), false);
  assert.equal(isValidUsername('bad-name'), false);
  assert.equal(isValidUsername('x'.repeat(31)), false);
});

test('decodes relevant HTML entities and extracts dates', () => {
  assert.equal(decodeHtmlEntities('a&amp;b&quot;c&#39;d&lt;e&gt;'), 'a&b"c\'d<e>');
  assert.equal(extractNearbyDate('<div>March 12, 2025, 10:42 AM</div>'), 'March 12, 2025, 10:42 AM');
  assert.equal(extractNearbyDate('<div>12 de março de 2025, 10:42</div>'), '12 de março de 2025, 10:42');
  assert.equal(extractNearbyDate('<div>12/03/2025 10:42</div>'), '12/03/2025 10:42');
  assert.equal(extractNearbyDate('<script>12/03/2025</script>nothing'), undefined);
});

test('parses, canonicalizes and deduplicates export anchors', () => {
  const html = `
    <div><a href="https://www.instagram.com/_u/Alice/">Alice</a><div>March 12, 2025</div></div>
    <div><a href='https://instagram.com/bob/'>Bob</a></div>
    <div><a href="https://www.instagram.com/alice/">duplicate</a></div>
    <div><a href="https://evil.example/charlie/">evil</a></div>
  `;
  const result = parseInstagramExport(html);
  assert.equal(result.length, 2);
  assert.equal(result[0].username, 'alice');
  assert.equal(result[0].followedAt, 'March 12, 2025');
  assert.equal(result[1].username, 'bob');
});

test('rejects empty or unsupported HTML', () => {
  assert.throws(() => parseInstagramExport('   '), /vazio/);
  assert.throws(() => parseInstagramExport('<html><a href="https://example.com/x">x</a></html>'), /Nenhum perfil válido/);
});
