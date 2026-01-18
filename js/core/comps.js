// core/comps.js
import { clamp, percentile, normalizeKeyPart } from "./utils.js";

/**
 * Build comp stats from sold prices and sold counts.
 * @param {string} key
 * @param {number[]} soldPrices
 * @param {number} soldCount30d
 * @param {number} soldCount90d
 * @returns {import("./types.js").CompStats}
 */
export function buildCompStats(key, soldPrices, soldCount30d = 0, soldCount90d = 0) {
  const prices = (soldPrices || [])
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);

  const p25 = prices.length ? percentile(prices, 0.25) : 0;
  const p50 = prices.length ? percentile(prices, 0.50) : 0;
  const p75 = prices.length ? percentile(prices, 0.75) : 0;

  const varianceRatio = p50 > 0 ? clamp((p75 - p25) / p50, 0, 10) : 10;

  return {
    key: String(key || ""),
    soldPrices: prices,
    p25,
    p50,
    p75,
    varianceRatio,
    soldCount30d: Math.max(0, soldCount30d | 0),
    soldCount90d: Math.max(0, soldCount90d | 0)
  };
}

/**
 * Conservative expected resale from comp stats.
 * @param {import("./types.js").CompStats} comp
 * @returns {number}
 */
export function expectedResaleFromComp(comp) {
  if (!comp) return 0;
  const { p25, p50, varianceRatio, soldCount30d, soldCount90d } = comp;

  // Conservative: trust median only when data is solid
  if (soldCount30d >= 5 && varianceRatio <= 0.35) return p50;
  if (soldCount90d >= 5) return (p25 + p50) / 2;
  return p25;
}

/**
 * Liquidity score 0..100
 * @param {import("./types.js").CompStats|null} comp
 */
export function liquidityScore(comp) {
  if (!comp) return 0;
  const v = (comp.soldCount30d * 8) + (comp.soldCount90d * 2);
  return clamp(v, 0, 100);
}

/**
 * Create a comp lookup key for RAW or GRADED variants.
 * You will improve this later when parsing is better.
 */
export function makeCompKey({ cardName, setName, cardNumber, rawOrGraded, grader, grade }) {
  const base = [
    "pokemon",
    normalizeKeyPart(cardName),
    normalizeKeyPart(setName),
    normalizeKeyPart(cardNumber)
  ].join("|");

  if (rawOrGraded === "GRADED") {
    return `${base}|graded|${normalizeKeyPart(grader)}|${String(grade ?? "")}`;
  }
  return `${base}|raw`;
}
