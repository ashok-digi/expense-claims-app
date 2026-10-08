const HttpError = require('../utils/httpError');
const repository = require('../repositories/claims.repository');
const { createClaim } = require('../models/claim.model');
const ratesService = require('./rates.service');

function list() {
  return repository.findAll();
}

function get(id) {
  const claim = repository.findById(id);
  if (!claim) throw new HttpError(404, `Claim ${id} not found`);
  return claim;
}

async function submit(data) {
  const amountUSD = await ratesService.amountInUsd(data.amount, data.currency);
  return repository.save(createClaim({ ...data, amountUSD }));
}

// Full replacement of the editable fields; status is kept if not supplied.
// amountUSD is recomputed so it never goes stale when amount or currency changes.
async function update(id, data) {
  const existing = get(id);
  const amountUSD = await ratesService.amountInUsd(data.amount, data.currency);
  return repository.save({
    ...existing,
    ...data,
    amountUSD,
    status: data.status ?? existing.status,
    id: existing.id,
  });
}

function remove(id) {
  get(id);
  repository.remove(id);
}

module.exports = { list, get, submit, update, remove };
