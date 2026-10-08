const HttpError = require('../utils/httpError');
const repository = require('../repositories/claims.repository');
const { createClaim } = require('../models/claim.model');

function list() {
  return repository.findAll();
}

function get(id) {
  const claim = repository.findById(id);
  if (!claim) throw new HttpError(404, `Claim ${id} not found`);
  return claim;
}

function submit(data) {
  return repository.save(createClaim(data));
}

// Full replacement of the editable fields; status is kept if not supplied.
function update(id, data) {
  const existing = get(id);
  return repository.save({
    ...existing,
    ...data,
    status: data.status ?? existing.status,
    id: existing.id,
  });
}

function remove(id) {
  get(id);
  repository.remove(id);
}

module.exports = { list, get, submit, update, remove };
