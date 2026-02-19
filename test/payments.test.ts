import test from "node:test";
import assert from "node:assert/strict";
import { computePayoutCents, isAuthorized } from "../src/payments.js";

test("computePayoutCents basic", () => {
  assert.equal(computePayoutCents(10, 0), 1000);
  assert.equal(computePayoutCents(10, 100), 990); // 1%
});

test("isAuthorized exact", () => {
  // This test misses the bypass case intentionally.
  assert.equal(isAuthorized("super-secret-demo-token", "super-secret-demo-token"), true);
  assert.equal(isAuthorized("nope", "super-secret-demo-token"), false);
});
