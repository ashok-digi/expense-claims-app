const BASE_URL = '/api/claims';

async function request(url, options) {
  const response = await fetch(url, options);
  if (response.ok) return response.json();

  let message = `Request failed (${response.status})`;
  try {
    const { error } = await response.json();
    const details = (error.details ?? []).map((d) => d.message);
    message = details.length > 0 ? details.join('. ') : error.message;
  } catch {
    // Non-JSON error body; keep the generic message.
  }
  throw new Error(message);
}

export function listClaims() {
  return request(BASE_URL);
}

export function submitClaim(claim) {
  return request(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(claim),
  });
}
