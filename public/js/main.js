import { listClaims, submitClaim } from './api.js';
import { renderClaims } from './table.js';

const tbody = document.getElementById('claims-body');
const tableMessage = document.getElementById('table-message');
const form = document.getElementById('claim-form');
const formMessage = document.getElementById('form-message');

async function refreshTable() {
  try {
    const claims = await listClaims();
    renderClaims(tbody, claims);
    tableMessage.textContent = claims.length === 0 ? 'No claims yet.' : '';
  } catch (err) {
    tableMessage.textContent = `Could not load claims: ${err.message}`;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formMessage.textContent = '';

  const data = new FormData(form);
  const claim = {
    employeeName: data.get('employeeName'),
    description: data.get('description'),
    category: data.get('category'),
    amount: Number(data.get('amount')),
    currency: data.get('currency'),
    expenseDate: data.get('expenseDate'),
  };

  try {
    await submitClaim(claim);
    form.reset();
    formMessage.textContent = 'Claim submitted.';
    await refreshTable();
  } catch (err) {
    formMessage.textContent = err.message;
  }
});

refreshTable();
