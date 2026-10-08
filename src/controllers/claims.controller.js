const service = require('../services/claims.service');

function list(req, res) {
  res.json(service.list());
}

function get(req, res) {
  res.json(service.get(req.params.id));
}

function submit(req, res) {
  res.status(201).json(service.submit(req.body));
}

function update(req, res) {
  res.json(service.update(req.params.id, req.body));
}

function remove(req, res) {
  service.remove(req.params.id);
  res.status(204).end();
}

module.exports = { list, get, submit, update, remove };
