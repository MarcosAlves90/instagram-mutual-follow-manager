import test from 'node:test';
import assert from 'node:assert/strict';
import { compareRelationships, deduplicateProfiles, normalizeUsername } from '../src/domain/relationships.js';

const profile = (username) => ({ username, profileUrl: `https://www.instagram.com/${username}/` });

test('normalizes usernames', () => {
  assert.equal(normalizeUsername(' @Alice '), 'alice');
});

test('deduplicates profiles case-insensitively and preserves first metadata', () => {
  const result = deduplicateProfiles([
    { ...profile('Alice'), followedAt: 'old' },
    { ...profile('alice'), followedAt: 'new' },
    profile(''),
  ]);
  assert.deepEqual(result, [{ username: 'alice', profileUrl: 'https://www.instagram.com/Alice/', followedAt: 'old' }]);
});

test('compares followers and following in both directions', () => {
  const result = compareRelationships(
    [profile('alice'), profile('bob'), profile('same')],
    [profile('bob'), profile('carol'), profile('same')],
  );
  assert.deepEqual(result.notFollowingBack.map((item) => item.username), ['carol']);
  assert.deepEqual(result.notFollowedBack.map((item) => item.username), ['alice']);
  assert.equal(result.mutualCount, 2);
});
