const { randomUUID } = require('node:crypto');

const CATEGORIES = ['travel', 'meals', 'lodging', 'supplies', 'other'];
const STATUSES = ['submitted', 'approved', 'rejected'];
const DEFAULT_STATUS = 'submitted';

// amountUSD is derived by the service from the exchange-rates file; null if the currency has no rate.
function createClaim({ employeeName, description, category, amount, currency, amountUSD, expenseDate, status }) {
  return {
    id: randomUUID(),
    employeeName,
    description,
    category,
    amount,
    currency,
    amountUSD: amountUSD ?? null,
    expenseDate,
    status: status ?? DEFAULT_STATUS,
  };
}

module.exports = { CATEGORIES, STATUSES, DEFAULT_STATUS, createClaim };
