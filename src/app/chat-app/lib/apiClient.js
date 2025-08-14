import { baseUrl } from '../config';

export async function apiGet(path, { signal } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal,
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiPost(path, body, { signal } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiUpload(path, files, extra = {}, { signal } = {}) {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  Object.entries(extra).forEach(([k, v]) => form.append(k, v));
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    body: form,
    signal,
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`UPLOAD ${path} failed: ${res.status}`);
  return res.json();
}

export async function apiDelete(path, { signal } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    signal,
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return res.json();
}

