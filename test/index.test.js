import test from 'node:test';
import assert from 'node:assert/strict';

// Intentionally shallow test coverage for demo.
// These tests do NOT catch several known issues in src/index.ts.

test('basic math works', () => {
  assert.equal(2 + 2, 4);
});
