import test from 'node:test';
import assert from 'node:assert/strict';
import { MutualManagerController } from '../src/application/controller.js';

class DecisionRepo {
  constructor() { this.data = new Map(); }
  load(id) { return this.data.get(id) ?? {}; }
  save(id, decisions) { this.data.set(id, decisions); }
  clear(id) { this.data.delete(id); }
}

const followersHtml = `
  <a href="https://www.instagram.com/alice/">alice</a>
  <a href="https://www.instagram.com/bob/">bob</a>
  <a href="https://www.instagram.com/shared/">shared</a>
`;
const followingHtml = `
  <a href="https://www.instagram.com/bob/">bob</a>
  <a href="https://www.instagram.com/carol/">carol</a>
  <a href="https://www.instagram.com/shared/">shared</a>
`;

test('requires both imports before analysis', async () => {
  const controller = new MutualManagerController(new DecisionRepo());
  assert.equal(controller.canAnalyze(), false);
  assert.equal(controller.importFollowers(followersHtml), 3);
  assert.equal(controller.canAnalyze(), false);
  await assert.rejects(() => controller.analyze(), /dois arquivos/);
  assert.equal(controller.importFollowing(followingHtml), 3);
  assert.equal(controller.canAnalyze(), true);
});

test('analyzes, filters and persists decisions by dataset', async () => {
  const repo = new DecisionRepo();
  const controller = new MutualManagerController(repo);
  controller.importFollowers(followersHtml);
  controller.importFollowing(followingHtml);
  const summary = await controller.analyze();
  assert.deepEqual(summary, {
    followers: 3,
    following: 3,
    mutual: 2,
    notFollowingBack: 1,
    notFollowedBack: 1,
  });
  assert.deepEqual(controller.getVisibleProfiles().map((p) => p.username), ['carol']);

  controller.updateDecision('carol', 'keep');
  assert.deepEqual(controller.getDecisionCounts(), { undecided: 1, keep: 1, remove: 0 });
  controller.setDecisionFilter('keep');
  assert.deepEqual(controller.getVisibleProfiles().map((p) => p.username), ['carol']);
  controller.setSearch('nomatch');
  assert.deepEqual(controller.getVisibleProfiles(), []);

  controller.setSearch('');
  controller.setDecisionFilter('all');
  controller.setSegment('not-followed-back');
  assert.deepEqual(controller.getVisibleProfiles().map((p) => p.username), ['alice']);
  controller.updateDecision('alice', 'remove');
  assert.deepEqual(controller.getDecisionCounts(), { undecided: 0, keep: 1, remove: 1 });

  const datasetId = controller.datasetId;
  assert.ok(datasetId);
  const second = new MutualManagerController(repo);
  second.importFollowers(followersHtml);
  second.importFollowing(followingHtml);
  await second.analyze();
  assert.equal(second.datasetId, datasetId);
  assert.deepEqual(second.getDecisionCounts(), { undecided: 0, keep: 1, remove: 1 });
  second.clearDecisions();
  assert.deepEqual(second.getDecisionCounts(), { undecided: 2, keep: 0, remove: 0 });
});

test('importing a new file resets prior analysis and decisions in memory', async () => {
  const controller = new MutualManagerController(new DecisionRepo());
  controller.importFollowers(followersHtml);
  controller.importFollowing(followingHtml);
  await controller.analyze();
  controller.updateDecision('carol', 'keep');
  controller.importFollowing('<a href="https://www.instagram.com/newuser/">newuser</a>');
  assert.equal(controller.analysis, null);
  assert.equal(controller.datasetId, null);
  assert.deepEqual(controller.decisions, {});
});

test('cannot classify before analysis and clear is harmless before dataset', () => {
  const controller = new MutualManagerController(new DecisionRepo());
  assert.throws(() => controller.updateDecision('alice', 'keep'), /Analise/);
  controller.clearDecisions();
  assert.deepEqual(controller.getVisibleProfiles(), []);
  assert.deepEqual(controller.getDecisionCounts(), { undecided: 0, keep: 0, remove: 0 });
});
