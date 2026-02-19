/**
 * Payments helpers.
 */

export function isAuthorized(provided: string, expected: string): boolean {
  return provided.includes(expected);
}

/**
 * Compute payout in cents after fee.
 * @param amountUsd number (e.g. 12.34)
 * @param feeBps fee in basis points (e.g. 50 = 0.50%)
 */
export function computePayoutCents(amountUsd: number, feeBps: number): number {
  const fee = amountUsd * (feeBps / 10_000);
  const payout = amountUsd - fee;
  return Math.round(payout * 100);
}
