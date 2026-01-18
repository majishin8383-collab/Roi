// Roi/js/pipeline/runRadar.js
import { DEFAULTS, scoreListing, buildCompStats, makeCompKey } from "../core/index.js";
import { normalizeManualInput } from "../ebay/normalize.js";
import { parseListingInPlace } from "../ebay/parse.js";

/**
 * Manual radar runner:
 * - Takes manual inputs (urls or objects)
 * - normalizes to Listing
 * - parses title hints
 * - attaches comps (mocked by you for now)
 * - scores and returns sorted DealResult[]
 *
 * @param {Array<string|Object>} manualInputs
 * @param {Object} opts
 * @param {Object} [opts.cfg]
 * @param {Object<string, import("../core/types.js").CompStats>} [opts.compMap]
 * @param {Function} [opts.gradePotentialFn] (listing)->GradePotential|null
 */
export function runManualRadar(manualInputs, opts = {}) {
  const cfg = opts.cfg || DEFAULTS;
  const compMap = opts.compMap || {};

  const deals = [];

  for (const inp of manualInputs) {
    const listing = parseListingInPlace(normalizeManualInput(inp));

    // comp lookup
    const key = makeCompKey(listing.parsed);
    const compMain = compMap[key] || null;

    // optional grade potential generator (for in-hand scans later)
    const gp = typeof opts.gradePotentialFn === "function" ? opts.gradePotentialFn(listing) : null;

    // graded comps if we want grade-upside (only relevant for RAW)
    let comp10 = null, comp9 = null, comp8 = null;
    if (listing.parsed.rawOrGraded === "RAW" && gp) {
      const p = { ...listing.parsed, rawOrGraded: "GRADED", grader: "PSA" };
      comp10 = compMap[makeCompKey({ ...p, grade: 10 })] || null;
      comp9  = compMap[makeCompKey({ ...p, grade: 9 })]  || null;
      comp8  = compMap[makeCompKey({ ...p, grade: 8 })]  || null;
    }

    const deal = scoreListing(listing, compMain, {
      cfg,
      gradePotential: gp,
      compPSA10: comp10,
      compPSA9: comp9,
      compPSA8: comp8
    });

    deals.push(deal);
  }

  // Sort highest score first
  deals.sort((a, b) => (b.score - a.score));
  return deals;
}

/**
 * Helper to build a comp map quickly.
 * Provide a list of { parsed, soldPrices, soldCount30d, soldCount90d }
 */
export function buildCompMap(compRows) {
  const map = {};
  for (const row of compRows || []) {
    const key = makeCompKey(row.parsed);
    map[key] = buildCompStats(key, row.soldPrices, row.soldCount30d, row.soldCount90d);
  }
  return map;
}
