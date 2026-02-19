/**
 * Serverless handler — TODO: implement.
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

export function handler(req: Request): Response {
  // TODO: implement request handling with auth and payout
  return { status: 501, body: { error: "not implemented" } };
}
