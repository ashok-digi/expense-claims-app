const TIER_LABELS = { auto: 'Auto', manager: 'Manager', finance: 'Finance' };

// The API decides the tier; the frontend only maps it to a label (null = no USD amount to tier).
export function tierLabel(tier) {
  return tier == null ? '—' : (TIER_LABELS[tier] ?? tier);
}

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
        cell(tierLabel(claim.approvalTier)),
        cell(claim.expenseDate),
        cell(claim.status),
      );
      return tr;
    }),
  );
}
