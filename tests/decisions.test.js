import test from 'node:test';
import assert from 'node:assert/strict';
import { countDecisions, getDecision, isRelationshipDecision, setDecision } from '../src/domain/decisions.js';

test('validates supported decisions', () => {
  assert.equal(isRelationshipDecision('keep'), true);
  assert.equal(isRelationshipDecision('remove'), true);
  assert.equal(isRelationshipDecision('undecided'), true);
  assert.equal(isRelationshipDecision('later'), false);
});

test('sets, reads and removes decisions', () => {
  let decisions = setDecision({}, '@Alice', 'keep');
  assert.deepEqual(decisions, { alice: 'keep' });
  assert.equal(getDecision(decisions, 'ALICE'), 'keep');
  decisions = setDecision(decisions, 'alice', 'undecided');
  assert.deepEqual(decisions, {});
  assert.equal(getDecision(decisions, 'alice'), 'undecided');
  assert.deepEqual(setDecision({ x: 'remove' }, ' ', 'keep'), { x: 'remove' });
});

test('counts decisions with undecided as default', () => {
  assert.deepEqual(countDecisions(['alice', 'bob', 'carol'], { alice: 'keep', bob: 'remove' }), {
    undecided: 1,
    keep: 1,
    remove: 1,
  });
});
