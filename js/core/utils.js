// core/utils.js

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}

export function sum(arr) {
  let s = 0;
  for (const x of arr) s += x;
  return s;
}

export function median(sortedArr) {
  const n = sortedArr.length;
  if (!n) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 ? sortedArr[mid] : (sortedArr[mid - 1] + sortedArr[mid]) / 2;
}

export function percentile(sortedArr, p) {
  // p in [0,1]
  const n = sortedArr.length;
  if (!n) return 0;
  const idx = (n - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedArr[lo];
  const w = idx - lo;
  return sortedArr[lo] * (1 - w) + sortedArr[hi] * w;
}

export function safeNumber(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeKeyPart(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\/\-\s]/g, "");
}
