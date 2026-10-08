const { randomUUID } = require('node:crypto');

const CATEGORIES = ['travel', 'meals', 'lodging', 'supplies', 'other'];
const STATUSES = ['submitted', 'approved', 'rejected'];
const DEFAULT_STATUS = 'submitted';

function createClaim({ employeeName, description, category, amount, currency, expenseDate, status }) {
  return {
    id: randomUUID(),
    employeeName,
    description,
    category,
    amount,
    currency,
    expenseDate,
    status: status ?? DEFAULT_STATUS,
  };
}

module.exports = { CATEGORIES, STATUSES, DEFAULT_STATUS, createClaim };
