// @ts-check

import { isRelationshipDecision } from '../domain/decisions.js';

/** @typedef {import('../domain/decisions.js').DecisionMap} DecisionMap */
/** @typedef {'system' | 'light' | 'dark'} Appearance */

const DECISION_PREFIX = 'ig-mutual-manager:v2:decisions:';
const APPEARANCE_KEY = 'ig-mutual-manager:v2:appearance';

export class DecisionRepository {
  /** @param {Storage} storage */
  constructor(storage) {
    this.storage = storage;
  }

  /** @param {string} datasetId @returns {DecisionMap} */
  load(datasetId) {
    try {
      const raw = this.storage.getItem(`${DECISION_PREFIX}${datasetId}`);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

      /** @type {DecisionMap} */
      const decisions = {};
      for (const [username, decision] of Object.entries(parsed)) {
        if (isRelationshipDecision(decision) && decision !== 'undecided') {
          decisions[username] = decision;
        }
      }
      return decisions;
    } catch {
      return {};
    }
  }

  /** @param {string} datasetId @param {DecisionMap} decisions */
  save(datasetId, decisions) {
    this.storage.setItem(`${DECISION_PREFIX}${datasetId}`, JSON.stringify(decisions));
  }

  /** @param {string} datasetId */
  clear(datasetId) {
    this.storage.removeItem(`${DECISION_PREFIX}${datasetId}`);
  }
}

export class PreferencesRepository {
  /** @param {Storage} storage */
  constructor(storage) {
    this.storage = storage;
  }

  /** @returns {Appearance} */
  loadAppearance() {
    const value = this.storage.getItem(APPEARANCE_KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  }

  /** @param {Appearance} appearance */
  saveAppearance(appearance) {
    this.storage.setItem(APPEARANCE_KEY, appearance);
  }
}
