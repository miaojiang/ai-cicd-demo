/**
 * Intentional-bug demo module.
 * Pretend this runs as a serverless handler.
 */

import { computePayoutCents, isAuthorized } from "./payments.js";

export type Request = {
  headers: Record<string, string | undefined>;
  body: unknown;
};

export type Response = {
  status: number;
  body: unknown;
};

// INTENTIONAL BUGS:
// - Uses a hard-coded secret token (should be env / secret manager)
// - Logs the token
// - Authorization check is naive
const SECRET_TOKEN = "super-secret-demo-token";

export function handler(req: Request): Response {
  const token = req.headers["x-api-token"] || "";

  // BUG: logs sensitive token
  console.log("auth token:", token);

  // BUG: naive auth check in payments.ts
  if (!isAuthorized(token, SECRET_TOKEN)) {
    return { status: 401, body: { error: "unauthorized" } };
  }

  // BUG: assumes body shape without validation
  const { amountUsd, feeBps } = req.body as any;

  // BUG: can throw / behave oddly with NaN / strings
  const payout = computePayoutCents(amountUsd, feeBps);

  return { status: 200, body: { payoutCents: payout } };
}
