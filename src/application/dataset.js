// @ts-check

import { deduplicateProfiles } from '../domain/relationships.js';

/**
 * @typedef {import('../domain/relationships.js').InstagramProfile} InstagramProfile
 */

/**
 * @param {InstagramProfile[]} followers
 * @param {InstagramProfile[]} following
 * @param {Crypto} cryptoImpl
 */
export async function createDatasetId(followers, following, cryptoImpl = globalThis.crypto) {
  if (!cryptoImpl?.subtle) {
    throw new Error('Web Crypto API is required to create a dataset identity.');
  }

  const payload = JSON.stringify({
    followers: deduplicateProfiles(followers).map((profile) => profile.username).sort(),
    following: deduplicateProfiles(following).map((profile) => profile.username).sort(),
  });
  const digest = await cryptoImpl.subtle.digest('SHA-256', new TextEncoder().encode(payload));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 24);
}
