// src/vtech/safe.js — tiny safety helpers (no dependencies)
 
/** Returns a clean absolute http(s) URL, or null if it is unsafe (javascript:, data:, wrong host...). */
export function safeExternalUrl(raw, { hosts = [] } = {}) {
  try {
    const base = typeof window !== 'undefined' ? window.location.href : 'https://example.com';
    const u = new URL(String(raw), base);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    if (hosts.length && !hosts.some((h) => u.hostname === h || u.hostname.endsWith('.' + h))) return null;
    return u.href;
  } catch {
    return null;
  }
}
 
/** Opens a link in a new tab safely. Returns true if it was allowed. */
export function openExternal(raw, opts) {
  const url = safeExternalUrl(raw, opts);
  if (!url || typeof window === 'undefined') return false;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
 
/** Cleans free text typed by a visitor before you put it in a message/URL. */
export function cleanField(value, max = 500) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // control characters
    .trim()
    .slice(0, max);
}
