import { convertToUsd, listClaims, submitClaim } from './api.js';
import { renderClaims } from './table.js';

const tbody = document.getElementById('claims-body');
const tableMessage = document.getElementById('table-message');
const form = document.getElementById('claim-form');
const formMessage = document.getElementById('form-message');
const amountInput = form.elements.amount;
const currencyInput = form.elements.currency;
const convertButton = document.getElementById('convert-btn');
const convertResult = document.getElementById('convert-result');

async function refreshTable() {
  try {
    const claims = await listClaims();
    renderClaims(tbody, claims);
    tableMessage.textContent = claims.length === 0 ? 'No claims yet.' : '';
  } catch (err) {
    tableMessage.textContent = `Could not load claims: ${err.message}`;
  }
}

convertButton.addEventListener('click', async () => {
  const amount = amountInput.valueAsNumber;
  const currency = currencyInput.value.trim();
  if (!(amount > 0)) {
    convertResult.textContent = 'Enter an amount greater than 0 to convert.';
    return;
  }
  if (!/^[A-Za-z]{3}$/.test(currency)) {
    convertResult.textContent = 'Enter a 3-letter currency code to convert.';
    return;
  }

  convertResult.textContent = 'Converting…';
  try {
    const result = await convertToUsd(amount, currency);
    convertResult.textContent =
      `${result.amount.toFixed(2)} ${result.currency} ≈ ${result.amountUSD.toFixed(2)} USD ` +
      `(rate: ${result.rate} ${result.currency} per 1 USD)`;
  } catch (err) {
    convertResult.textContent = err.message;
  }
});

// A shown conversion is stale once the amount or currency changes.
for (const input of [amountInput, currencyInput]) {
  input.addEventListener('input', () => {
    convertResult.textContent = '';
  });
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
    convertResult.textContent = '';
    formMessage.textContent = 'Claim submitted.';
    await refreshTable();
  } catch (err) {
    formMessage.textContent = err.message;
  }
});

refreshTable();
