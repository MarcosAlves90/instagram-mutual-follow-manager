// @ts-check

import { compareRelationships } from '../domain/relationships.js';
import { countDecisions, getDecision, setDecision } from '../domain/decisions.js';
import { createDatasetId } from './dataset.js';
import { parseInstagramExport } from '../infrastructure/instagram-export.js';

/** @typedef {import('../domain/relationships.js').InstagramProfile} InstagramProfile */
/** @typedef {import('../domain/decisions.js').RelationshipDecision} RelationshipDecision */
/** @typedef {import('../domain/decisions.js').DecisionMap} DecisionMap */
/** @typedef {'not-following-back' | 'not-followed-back'} Segment */
/** @typedef {'all' | RelationshipDecision} DecisionFilter */

export class MutualManagerController {
  /**
   * @param {{load(datasetId: string): DecisionMap, save(datasetId: string, decisions: DecisionMap): void, clear(datasetId: string): void}} decisionRepository
   */
  constructor(decisionRepository) {
    this.decisionRepository = decisionRepository;
    /** @type {InstagramProfile[]} */
    this.followers = [];
    /** @type {InstagramProfile[]} */
    this.following = [];
    this.followersLoaded = false;
    this.followingLoaded = false;
    this.analysis = null;
    this.datasetId = null;
    /** @type {DecisionMap} */
    this.decisions = {};
    /** @type {Segment} */
    this.segment = 'not-following-back';
    /** @type {DecisionFilter} */
    this.decisionFilter = 'all';
    this.search = '';
  }

  /** @param {string} html */
  importFollowers(html) {
    this.followers = parseInstagramExport(html);
    this.followersLoaded = true;
    this.resetAnalysis();
    return this.followers.length;
  }

  /** @param {string} html */
  importFollowing(html) {
    this.following = parseInstagramExport(html);
    this.followingLoaded = true;
    this.resetAnalysis();
    return this.following.length;
  }

  canAnalyze() {
    return this.followersLoaded && this.followingLoaded;
  }

  async analyze() {
    if (!this.canAnalyze()) {
      throw new Error('Importe os dois arquivos antes de analisar.');
    }

    this.datasetId = await createDatasetId(this.followers, this.following);
    this.decisions = this.decisionRepository.load(this.datasetId);
    this.analysis = compareRelationships(this.followers, this.following);
    return this.getSummary();
  }

  /** @param {Segment} segment */
  setSegment(segment) {
    this.segment = segment;
  }

  /** @param {string} search */
  setSearch(search) {
    this.search = search.trim().toLowerCase();
  }

  /** @param {DecisionFilter} filter */
  setDecisionFilter(filter) {
    this.decisionFilter = filter;
  }

  /** @param {string} username @param {RelationshipDecision} decision */
  updateDecision(username, decision) {
    if (!this.datasetId) throw new Error('Analise um conjunto de dados antes de classificar perfis.');
    this.decisions = setDecision(this.decisions, username, decision);
    this.decisionRepository.save(this.datasetId, this.decisions);
  }

  clearDecisions() {
    if (!this.datasetId) return;
    this.decisionRepository.clear(this.datasetId);
    this.decisions = {};
  }

  getVisibleProfiles() {
    if (!this.analysis) return [];
    const source = this.segment === 'not-following-back'
      ? this.analysis.notFollowingBack
      : this.analysis.notFollowedBack;

    return source.filter((profile) => {
      if (this.search && !profile.username.includes(this.search)) return false;
      const decision = getDecision(this.decisions, profile.username);
      return this.decisionFilter === 'all' || decision === this.decisionFilter;
    });
  }

  getSummary() {
    if (!this.analysis) {
      return {
        followers: this.followers.length,
        following: this.following.length,
        mutual: 0,
        notFollowingBack: 0,
        notFollowedBack: 0,
      };
    }

    return {
      followers: this.followers.length,
      following: this.following.length,
      mutual: this.analysis.mutualCount,
      notFollowingBack: this.analysis.notFollowingBack.length,
      notFollowedBack: this.analysis.notFollowedBack.length,
    };
  }

  getDecisionCounts() {
    const users = this.analysis
      ? [...this.analysis.notFollowingBack, ...this.analysis.notFollowedBack]
          .map((profile) => profile.username)
          .filter((username, index, all) => all.indexOf(username) === index)
      : [];
    return countDecisions(users, this.decisions);
  }

  resetAnalysis() {
    this.analysis = null;
    this.datasetId = null;
    this.decisions = {};
  }
}
