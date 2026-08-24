// @ts-check

const ALLOWED_HOSTS = new Set(['instagram.com', 'www.instagram.com']);
const RESERVED_PATHS = new Set([
  'accounts',
  'about',
  'developer',
  'direct',
  'explore',
  'legal',
  'p',
  'reel',
  'reels',
  'stories',
]);

/**
 * @typedef {Object} InstagramProfile
 * @property {string} username
 * @property {string} profileUrl
 * @property {string=} followedAt
 */

/**
 * @param {string} rawHref
 * @returns {InstagramProfile | null}
 */
export function profileFromInstagramHref(rawHref) {
  let parsed;
  try {
    parsed = new URL(decodeHtmlEntities(rawHref));
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
    return null;
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments[0] === '_u') segments.shift();
  if (segments.length !== 1) return null;

  const username = segments[0].trim().toLowerCase();
  if (!isValidUsername(username) || RESERVED_PATHS.has(username)) return null;

  return {
    username,
    profileUrl: `https://www.instagram.com/${encodeURIComponent(username)}/`,
  };
}

/** @param {string} username */
export function isValidUsername(username) {
  return /^[a-z0-9._]{1,30}$/i.test(username) && !username.startsWith('.') && !username.endsWith('.');
}

/**
 * Parse only anchor href attributes and nearby plain text. Imported HTML is never executed or injected.
 * @param {string} html
 * @returns {InstagramProfile[]}
 */
export function parseInstagramExport(html) {
  if (typeof html !== 'string' || html.trim().length === 0) {
    throw new Error('O arquivo HTML está vazio.');
  }

  /** @type {InstagramProfile[]} */
  const profiles = [];
  const seen = new Set();
  const anchorPattern = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = anchorPattern.exec(html)) !== null) {
    const profile = profileFromInstagramHref(match[2]);
    if (!profile || seen.has(profile.username)) continue;

    const context = html.slice(match.index + match[0].length, match.index + match[0].length + 360);
    const followedAt = extractNearbyDate(context);
    profiles.push(followedAt ? { ...profile, followedAt } : profile);
    seen.add(profile.username);
  }

  if (profiles.length === 0) {
    throw new Error('Nenhum perfil válido do Instagram foi encontrado neste arquivo.');
  }

  return profiles;
}

/** @param {string} value */
export function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

/** @param {string} htmlFragment */
export function extractNearbyDate(htmlFragment) {
  const text = decodeHtmlEntities(htmlFragment)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const patterns = [
    /\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}(?:,?\s+\d{1,2}:\d{2}(?::\d{2})?)?\b/,
    /\b(?:jan(?:uary|eiro)?|feb(?:ruary)?|fev(?:ereiro)?|mar(?:ch|ço)?|apr(?:il)?|abr(?:il)?|may|mai(?:o)?|jun(?:e|ho)?|jul(?:y|ho)?|aug(?:ust)?|ago(?:sto)?|sep(?:tember)?|set(?:embro)?|oct(?:ober)?|out(?:ubro)?|nov(?:ember)?|dez(?:embro)?|dec(?:ember)?)\s+\d{1,2},?\s+\d{4}(?:,?\s+\d{1,2}:\d{2}(?:\s*[AP]M)?)?/i,
    /\b\d{1,2}\s+(?:de\s+)?(?:janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)(?:\s+de)?\s+\d{4}(?:,?\s+\d{1,2}:\d{2})?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }

  return undefined;
}
