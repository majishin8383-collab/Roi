// Roi/js/app/testRadar.js
import { DEFAULTS, estimateGradePotential } from "../core/index.js";
import { runManualRadar } from "../pipeline/runRadar.js";

/**
 * REAL eBay item URLs (personal-use testing)
 */
const REAL_INPUTS = [
  "https://www.ebay.com/itm/287061434231",
  "https://www.ebay.com/itm/287061434221",
  "https://www.ebay.com/itm/257316182464"
];

export async function demoRunRadar() {
  if (!REAL_INPUTS.length) {
    throw new Error("No eBay URLs provided.");
  }

  // Optional grade potential heuristic (placeholder only)
  const gradePotentialFn = (listing) => {
    const t = String(listing?.title || "").toLowerCase();

    if (t.includes("charizard") && (t.includes("alt") || t.includes("alternate"))) {
      return estimateGradePotential(
        {
          centeringFront: 0.55,
          centeringBack: 0.56,
          cornerRisk: 0.25,
          edgeRisk: 0.25,
          surfaceRisk: 0.30
        },
        "MEDIUM"
      );
    }
    return null;
  };

  const deals = await Promise.resolve(
    runManualRadar(REAL_INPUTS, { cfg: DEFAULTS, gradePotentialFn })
  );

  return deals;
}
