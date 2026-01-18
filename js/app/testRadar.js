// Roi/js/app/testRadar.js
import { DEFAULTS, estimateGradePotential } from "../core/index.js";
import { runManualRadar } from "../pipeline/runRadar.js";

/**
 * ✅ Paste REAL eBay item URLs here (one per line).
 * Example:
 *   "https://www.ebay.com/itm/123456789012"
 */
const REAL_INPUTS = [
  // "https://www.ebay.com/itm/XXXXXXXXXXXX",
];

export async function demoRunRadar() {
  if (!Array.isArray(REAL_INPUTS) || REAL_INPUTS.length === 0) {
    throw new Error(
      "No real listings provided. Open Roi/js/app/testRadar.js and paste eBay item URLs into REAL_INPUTS."
    );
  }

  // Optional: keep your grade-potential stub logic (safe + minimal).
  // This DOES NOT scrape photos yet; it only applies if the title matches.
  const gradePotentialFn = (listing) => {
    const t = String(listing?.title || "").toLowerCase();

    // Example placeholder logic: you can delete this block if you want zero GP.
    // If you keep it, it only affects "GRADE_UPSIDE" scoring when listing is RAW.
    if (t.includes("charizard") && (t.includes("215/198") || t.includes("215 / 198"))) {
      return estimateGradePotential(
        { centeringFront: 0.56, centeringBack: 0.57, cornerRisk: 0.20, edgeRisk: 0.20, surfaceRisk: 0.20 },
        "HIGH"
      );
    }
    return null;
  };

  // runManualRadar may be sync or async depending on your pipeline version.
  // Promise.resolve makes this compatible either way.
  const deals = await Promise.resolve(
    runManualRadar(REAL_INPUTS, { cfg: DEFAULTS, gradePotentialFn })
  );

  return deals;
}
