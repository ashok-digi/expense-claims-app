// The one place the frontend's data shapes are defined. Mirrors the API (see docs/openapi.yaml).

export const CATEGORIES = ['travel', 'meals', 'lodging', 'supplies', 'other'] as const;
export type Category = (typeof CATEGORIES)[number];

export const STATUSES = ['submitted', 'approved', 'rejected'] as const;
export type Status = (typeof STATUSES)[number];

export const APPROVAL_TIERS = ['auto', 'manager', 'finance'] as const;
export type ApprovalTier = (typeof APPROVAL_TIERS)[number];

export interface Claim {
  id: string;
  employeeName: string;
  description: string;
  category: Category;
  amount: number;
  currency: string;
  /** Null when the currency has no exchange rate. */
  amountUSD: number | null;
  /** Null when there is no USD amount. */
  approvalTier: ApprovalTier | null;
  /** YYYY-MM-DD */
  expenseDate: string;
  status: Status;
}

/** What the client sends to submit a claim; id, USD amount, tier and status are set by the server. */
export type ClaimInput = Pick<
  Claim,
  'employeeName' | 'description' | 'category' | 'amount' | 'currency' | 'expenseDate'
>;

export interface ConversionResult {
  amount: number;
  currency: string;
  /** Units of `currency` per 1 USD. */
  rate: number;
  amountUSD: number;
  approvalTier: ApprovalTier | null;
}

// Runtime checks for data that arrives from the network as `unknown`.

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isCategory(value: unknown): value is Category {
  return CATEGORIES.some((category) => category === value);
}

function isStatus(value: unknown): value is Status {
  return STATUSES.some((status) => status === value);
}

function isApprovalTier(value: unknown): value is ApprovalTier {
  return APPROVAL_TIERS.some((tier) => tier === value);
}

const isNullableTier = (value: unknown): value is ApprovalTier | null =>
  value === null || isApprovalTier(value);

export function isClaim(value: unknown): value is Claim {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.employeeName === 'string' &&
    typeof value.description === 'string' &&
    isCategory(value.category) &&
    typeof value.amount === 'number' &&
    typeof value.currency === 'string' &&
    (value.amountUSD === null || typeof value.amountUSD === 'number') &&
    isNullableTier(value.approvalTier) &&
    typeof value.expenseDate === 'string' &&
    isStatus(value.status)
  );
}

export function isConversionResult(value: unknown): value is ConversionResult {
  return (
    isRecord(value) &&
    typeof value.amount === 'number' &&
    typeof value.currency === 'string' &&
    typeof value.rate === 'number' &&
    typeof value.amountUSD === 'number' &&
    isNullableTier(value.approvalTier)
  );
}
