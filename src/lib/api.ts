// Tiny typed fetcher for our own API routes.
export async function api<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const data = await res.json()
      msg = data.error || data.message || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json() as Promise<T>
}
