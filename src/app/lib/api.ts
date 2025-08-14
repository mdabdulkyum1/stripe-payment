// lib/api.ts
const BASE_URL = "http://localhost:1008/api/v1";
const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWQ3Y2Y4ZmRjZmI1NjJkNzQzZGFkZSIsImVtYWlsIjoia3l1bW1kYWJkdWxAZ21haWwuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3NTUxNTUwNTMsImV4cCI6MTc1Nzc0NzA1M30.RkAtcf4MGnR8-3UiSsP_MIBQu5oRwdiB4y0AhCK5JqM";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TEST_TOKEN}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
