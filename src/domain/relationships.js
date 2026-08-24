// @ts-check

/**
 * @typedef {Object} InstagramProfile
 * @property {string} username
 * @property {string} profileUrl
 * @property {string=} followedAt
 */

/**
 * @typedef {Object} RelationshipAnalysis
 * @property {InstagramProfile[]} notFollowingBack
 * @property {InstagramProfile[]} notFollowedBack
 * @property {number} mutualCount
 */

/** @param {string} username */
export function normalizeUsername(username) {
  return username.trim().replace(/^@/, '').toLowerCase();
}

/** @param {InstagramProfile[]} profiles */
export function deduplicateProfiles(profiles) {
  /** @type {Map<string, InstagramProfile>} */
  const unique = new Map();

  for (const profile of profiles) {
    const key = normalizeUsername(profile.username);
    if (!key || unique.has(key)) continue;
    unique.set(key, { ...profile, username: key });
  }

  return [...unique.values()];
}

/**
 * @param {InstagramProfile[]} followers
 * @param {InstagramProfile[]} following
 * @returns {RelationshipAnalysis}
 */
export function compareRelationships(followers, following) {
  const cleanFollowers = deduplicateProfiles(followers);
  const cleanFollowing = deduplicateProfiles(following);
  const followerNames = new Set(cleanFollowers.map((profile) => profile.username));
  const followingNames = new Set(cleanFollowing.map((profile) => profile.username));

  const notFollowingBack = cleanFollowing.filter(
    (profile) => !followerNames.has(profile.username),
  );
  const notFollowedBack = cleanFollowers.filter(
    (profile) => !followingNames.has(profile.username),
  );
  const mutualCount = cleanFollowers.filter((profile) => followingNames.has(profile.username)).length;

  return { notFollowingBack, notFollowedBack, mutualCount };
}
