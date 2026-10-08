const HttpError = require('../utils/httpError');
const { CATEGORIES, STATUSES } = require('../models/claim.model');
const { hasMaxTwoDecimals } = require('../utils/money');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Validates and normalizes the body for POST and PUT. Unknown fields are dropped, which includes
// amountUSD and approvalTier: they are derived server-side and never accepted from the client.
// status is optional here; the model/service decide the default.
function validateClaim(req, res, next) {
  const body = req.body;
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object');
  }

  const errors = [];
  const fail = (field, message) => errors.push({ field, message });

  if (!isNonEmptyString(body.employeeName)) fail('employeeName', 'employeeName is required');
  if (!isNonEmptyString(body.description)) fail('description', 'description is required');

  if (body.category === undefined) fail('category', 'category is required');
  else if (!CATEGORIES.includes(body.category)) {
    fail('category', `category must be one of: ${CATEGORIES.join(', ')}`);
  }

  if (body.amount === undefined) fail('amount', 'amount is required');
  else if (typeof body.amount !== 'number' || !Number.isFinite(body.amount) || body.amount <= 0) {
    fail('amount', 'amount must be a positive number');
  } else if (!hasMaxTwoDecimals(body.amount)) {
    fail('amount', 'amount must have at most two decimal places');
  }

  if (body.currency === undefined) fail('currency', 'currency is required');
  else if (typeof body.currency !== 'string' || !/^[A-Za-z]{3}$/.test(body.currency)) {
    fail('currency', 'currency must be a 3-letter code, e.g. USD');
  }

  if (body.expenseDate === undefined) fail('expenseDate', 'expenseDate is required');
  else if (!isValidDate(body.expenseDate)) {
    fail('expenseDate', 'expenseDate must be a valid date in YYYY-MM-DD format');
  }

  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    fail('status', `status must be one of: ${STATUSES.join(', ')}`);
  }

  if (errors.length > 0) throw new HttpError(400, 'Validation failed', errors);

  req.body = {
    employeeName: body.employeeName.trim(),
    description: body.description.trim(),
    category: body.category,
    amount: body.amount,
    currency: body.currency.toUpperCase(),
    expenseDate: body.expenseDate,
    ...(body.status !== undefined && { status: body.status }),
  };
  next();
}

module.exports = validateClaim;
