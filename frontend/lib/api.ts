export interface CatchResponse {
  claim: string
  catches: string[]
  nuanced_take: string
}

export async function analyzeClaim(claim: string): Promise<CatchResponse> {
  const res = await fetch('/api/catch/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { detail?: string }).detail || `Server error ${res.status}`)
  }

  return res.json() as Promise<CatchResponse>
}
