const { randomUUID } = require('node:crypto');

const CATEGORIES = ['travel', 'meals', 'lodging', 'supplies', 'other'];
const STATUSES = ['submitted', 'approved', 'rejected'];
const DEFAULT_STATUS = 'submitted';

// Approval tiers, by amountUSD: auto < MANAGER_MIN <= manager < FINANCE_MIN <= finance.
const TIERS = ['auto', 'manager', 'finance'];
const MANAGER_MIN_USD = 100;
const FINANCE_MIN_USD = 500;

// null when there is no USD amount (unsupported currency): the claim can't be tiered.
function approvalTierFor(amountUSD) {
  if (amountUSD == null) return null;
  if (amountUSD >= FINANCE_MIN_USD) return 'finance';
  if (amountUSD >= MANAGER_MIN_USD) return 'manager';
  return 'auto';
}

// amountUSD is derived by the service from the exchange-rates file; null if the currency has no rate.
// approvalTier is derived from amountUSD here and is never accepted from the client.
function createClaim({ employeeName, description, category, amount, currency, amountUSD, expenseDate, status }) {
  return {
    id: randomUUID(),
    employeeName,
    description,
    category,
    amount,
    currency,
    amountUSD: amountUSD ?? null,
    approvalTier: approvalTierFor(amountUSD),
    expenseDate,
    status: status ?? DEFAULT_STATUS,
  };
}

module.exports = { CATEGORIES, STATUSES, DEFAULT_STATUS, TIERS, approvalTierFor, createClaim };
