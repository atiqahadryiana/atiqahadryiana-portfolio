export async function adminApi(path, { token, body, method = body ? 'POST' : 'GET' } = {}) {
  let response;
  try {
    response = await fetch(`/__admin/${path}`, {
      method,
      credentials: 'same-origin',
      cache: 'no-store',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { 'X-Admin-Token': token } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      'The request could not be confirmed. Check your connection, then reload to see the latest saved content.',
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The local admin server could not be reached.');
  }
  if (!response.ok) {
    const error = new Error(data.error || 'The request could not be completed.');
    error.status = response.status;
    error.fields = data.fields;
    throw error;
  }
  return data;
}
