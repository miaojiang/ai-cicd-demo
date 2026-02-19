/**
 * Payments helpers.
 */

// INTENTIONAL BUGS:
// - Token check uses `includes` (trivially bypassable)
// - Floating point math can lose precision

export function isAuthorized(provided: string, expected: string): boolean {
  // BUG: any token containing expected substring passes
  return provided.includes(expected);
}

/**
 * Compute payout in cents after fee.
 * @param amountUsd number (e.g. 12.34)
 * @param feeBps fee in basis points (e.g. 50 = 0.50%)
 */
export function computePayoutCents(amountUsd: number, feeBps: number): number {
  // BUG: floating point rounding issues; should use integer cents from input.
  const fee = amountUsd * (feeBps / 10_000);
  const payout = amountUsd - fee;

  // BUG: `Math.round` can mask precision issues and allow negative amounts.
  return Math.round(payout * 100);
}
