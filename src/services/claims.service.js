const HttpError = require('../utils/httpError');
const repository = require('../repositories/claims.repository');
const { createClaim } = require('../models/claim.model');
const { valueInUsd } = require('./valuation.service');

/**
 * @typedef {'travel'|'meals'|'lodging'|'supplies'|'other'} Category
 * @typedef {'submitted'|'approved'|'rejected'} Status
 * @typedef {'auto'|'manager'|'finance'} ApprovalTier
 *
 * @typedef {object} ClaimInput Validated, normalized client data (see middleware/validateClaim.js).
 * @property {string} employeeName
 * @property {string} description
 * @property {Category} category
 * @property {number} amount Positive, at most two decimal places.
 * @property {string} currency Uppercase 3-letter code.
 * @property {string} expenseDate Calendar date in YYYY-MM-DD format.
 * @property {Status} [status] Optional; defaults to "submitted" on submit, kept on update.
 *
 * @typedef {object} Claim
 * @property {string} id
 * @property {string} employeeName
 * @property {string} description
 * @property {Category} category
 * @property {number} amount
 * @property {string} currency
 * @property {number|null} amountUSD Null when the currency has no exchange rate.
 * @property {ApprovalTier|null} approvalTier Null when amountUSD is null.
 * @property {string} expenseDate
 * @property {Status} status
 */

/**
 * Lists every stored claim, in insertion order.
 *
 * @returns {Claim[]} All claims; an empty array when none exist.
 */
function list() {
  return repository.findAll();
}

/**
 * Looks up a single claim by its id.
 *
 * @param {string} id - Id of the claim to fetch.
 * @returns {Claim} The matching claim.
 * @throws {HttpError} 404 when no claim has this id.
 */
function get(id) {
  const claim = repository.findById(id);
  if (!claim) throw new HttpError(404, `Claim ${id} not found`);
  return claim;
}

/**
 * Stores a new claim, deriving its USD amount and approval tier from the exchange-rates file.
 *
 * @param {ClaimInput} data - Validated claim fields; any client-supplied amountUSD or approvalTier must already be stripped.
 * @returns {Promise<Claim>} The saved claim, with a generated id, "submitted" status unless one was given, and amountUSD/approvalTier set (both null if the currency has no rate).
 * @throws {Error} If the exchange-rates file cannot be read or is not valid JSON.
 */
async function submit(data) {
  const usd = await valueInUsd(data.amount, data.currency);
  return repository.save(createClaim({ ...data, ...usd }));
}

/**
 * Replaces a claim's editable fields and recomputes amountUSD and approvalTier so they match
 * the new amount and currency.
 *
 * @param {string} id - Id of the claim to update; the id itself never changes.
 * @param {ClaimInput} data - Validated replacement fields; the existing status is kept when `status` is omitted.
 * @returns {Promise<Claim>} The updated claim.
 * @throws {HttpError} 404 when no claim has this id.
 * @throws {Error} If the exchange-rates file cannot be read or is not valid JSON.
 */
async function update(id, data) {
  const existing = get(id);
  const usd = await valueInUsd(data.amount, data.currency);
  return repository.save({
    ...existing,
    ...data,
    ...usd,
    status: data.status ?? existing.status,
    id: existing.id,
  });
}

/**
 * Permanently deletes a claim from storage.
 *
 * @param {string} id - Id of the claim to delete.
 * @returns {void}
 * @throws {HttpError} 404 when no claim has this id, so a repeated delete fails rather than succeeding silently.
 */
function remove(id) {
  get(id);
  repository.remove(id);
}

module.exports = { list, get, submit, update, remove };
