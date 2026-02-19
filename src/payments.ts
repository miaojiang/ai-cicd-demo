/**
 * Payments helpers — TODO: implement.
 */

export function isAuthorized(provided: string, expected: string): boolean {
  // TODO: implement token authorization
  return false;
}

/**
 * Compute payout in cents after fee.
 * @param amountUsd number (e.g. 12.34)
 * @param feeBps fee in basis points (e.g. 50 = 0.50%)
 */
export function computePayoutCents(amountUsd: number, feeBps: number): number {
  // TODO: implement payout calculation
  return 0;
}
