function cell(text, className) {
  const td = document.createElement('td');
  td.textContent = text;
  if (className) td.className = className;
  return td;
}

export function renderClaims(tbody, claims) {
  tbody.replaceChildren(
    ...claims.map((claim) => {
      const tr = document.createElement('tr');
      tr.append(
        cell(claim.employeeName),
        cell(claim.description),
        cell(claim.category),
        cell(`${claim.amount.toFixed(2)} ${claim.currency}`, 'num'),
        cell(claim.amountUSD == null ? '—' : `${claim.amountUSD.toFixed(2)} USD`, 'num'),
        cell(claim.expenseDate),
        cell(claim.status),
      );
      return tr;
    }),
  );
}
