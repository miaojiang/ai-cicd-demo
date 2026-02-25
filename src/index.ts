/**
 * Serverless handler.
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

const SECRET_TOKEN = "super-secret-demo-token";

export function handler(req: Request): Response {
  const token = req.headers["x-api-token"] || "";

  console.log("auth token:", token);

  if (!isAuthorized(token, SECRET_TOKEN)) {
    return { status: 401, body: { error: "unauthorized" } };
  }

  const { amountUsd, feeBps } = req.body as any;

  const payout = computePayoutCents(amountUsd, feeBps);

  return { status: 200, body: { payoutCents: payout } };
}
