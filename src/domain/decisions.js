// @ts-check

/** @typedef {'undecided' | 'keep' | 'remove'} RelationshipDecision */
/** @typedef {Record<string, RelationshipDecision>} DecisionMap */

/**
 * @param {unknown} value
 * @returns {value is RelationshipDecision}
 */
export function isRelationshipDecision(value) {
  return value === 'undecided' || value === 'keep' || value === 'remove';
}

/**
 * @param {DecisionMap} decisions
 * @param {string} username
 * @param {RelationshipDecision} decision
 * @returns {DecisionMap}
 */
export function setDecision(decisions, username, decision) {
  const key = username.trim().replace(/^@/, '').toLowerCase();
  if (!key) return { ...decisions };

  if (decision === 'undecided') {
    const next = { ...decisions };
    delete next[key];
    return next;
  }

  return { ...decisions, [key]: decision };
}

/**
 * @param {DecisionMap} decisions
 * @param {string} username
 * @returns {RelationshipDecision}
 */
export function getDecision(decisions, username) {
  return decisions[username.trim().replace(/^@/, '').toLowerCase()] ?? 'undecided';
}

/**
 * @param {string[]} usernames
 * @param {DecisionMap} decisions
 */
export function countDecisions(usernames, decisions) {
  const counts = { undecided: 0, keep: 0, remove: 0 };
  for (const username of usernames) {
    counts[getDecision(decisions, username)] += 1;
  }
  return counts;
}
