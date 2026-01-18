// core/scoring.js
import { clamp, round2 } from "./utils.js";
import { expectedResaleFromComp, liquidityScore } from "./comps.js";
import { totalCostIn, totalCostOutRaw, gradingCosts, ebayFees } from "./math.js";
import { isAtLeastConfidence } from "./gradePotential.js";

/**
 * Confidence score 0..100
 * @param {import("./types.js").Listing} listing
 * @param {import("./types.js").CompStats|null} comp
 * @param {import("./defaults.js").DEFAULTS} cfg
 */
export function confidenceScore(listing, comp, cfg) {
  const p = listing.parsed || {};
  const sold30 = comp?.soldCount30d ?? 0;
  const sold90 = comp?.soldCount90d ?? 0;
  const varianceRatio = comp?.varianceRatio ?? 2;

  const compStrength =
    clamp(sold30 * 10, 0, 40) +
    clamp(sold90 * 4, 0, 25);

  const matchBonus =
    (p.cardName ? 10 : 0) +
    (p.setName ? 8 : 0) +
    (p.cardNumber ? 10 : 0) +
    (p.tags?.includes?.("alt-art") || p.tags?.includes?.("sar") ? 4 : 0);

  const variancePenalty = clamp(varianceRatio * 100, 0, 25);

  const sellerPct = listing.sellerFeedbackPct ?? 0;
  const sellerPenalty =
    sellerPct >= 99 ? 0 :
    sellerPct >= 98 ? 6 :
    sellerPct >= 97 ? 12 : 20;

  const returnsPenalty = (cfg.requireReturns && !listing.returnsAccepted) ? 15 : 0;

  const hint = p.rawConditionHint || "UNK";
  const conditionPenalty =
    hint === "DMG" ? 35 :
    hint === "HP"  ? 25 :
    hint === "MP"  ? 15 :
    hint === "LP"  ?  6 :
    hint === "NM"  ?  0 : 8;

  return clamp(
    20 + compStrength + matchBonus
    - variancePenalty - sellerPenalty - returnsPenalty - conditionPenalty,
    0, 100
  );
}

/**
 * Compute deal results for:
 * - RAW flip
 * - GRADED flip
 * - RAW grade-upside (optional)
 *
 * @param {import("./types.js").Listing} listing
 * @param {import("./types.js").CompStats|null} compMain   // matched comp for same type (raw or graded)
 * @param {Object} opts
 * @param {import("./defaults.js").DEFAULTS} opts.cfg
 * @param {import("./types.js").GradePotential|null} [opts.gradePotential]
 * @param {import("./types.js").CompStats|null} [opts.compPSA10]
 * @param {import("./types.js").CompStats|null} [opts.compPSA9]
 * @param {import("./types.js").CompStats|null} [opts.compPSA8]
 * @returns {import("./types.js").DealResult}
 */
export function scoreListing(listing, compMain, opts) {
  const cfg = opts.cfg;
  const parsed = listing.parsed || {};
  const isBIN = listing.purchaseFormat === "BIN";

  const expectedResale = round2(expectedResaleFromComp(compMain));
  const totalIn = totalCostIn(listing.price, listing.shipping, cfg.taxBufferRate);

  // Base RAW/graded flip math (same, only comps differ)
  const outRaw = totalCostOutRaw(expectedResale, cfg);
  const profitRaw = round2(expectedResale - outRaw - totalIn);
  const roiRaw = totalIn > 0 ? profitRaw / totalIn : -1;

  const liquidity = liquidityScore(compMain);
  const confidence = confidenceScore(listing, compMain, cfg);

  let dealType = parsed.rawOrGraded === "GRADED" ? "GRADED_FLIP" : "RAW_FLIP";
  let netProfit = profitRaw;
  let roi = roiRaw;
  let totalOut = outRaw;

  // Grade-upside path for RAW only (optional)
  const gp = opts.gradePotential || null;

  if (parsed.rawOrGraded === "RAW" && gp) {
    const meetsPhoto = isAtLeastConfidence(gp.photoConfidence, cfg.gradeUpside.minPhotoConfidence);
    if (meetsPhoto) {
      const comp10 = opts.compPSA10 || null;
      const comp9  = opts.compPSA9  || null;
      const comp8  = opts.compPSA8  || null;

      const exp10 = comp10 ? expectedResaleFromComp(comp10) : 0;
      const exp9  = comp9  ? expectedResaleFromComp(comp9)  : 0;
      const exp8  = comp8  ? expectedResaleFromComp(comp8)  : 0;

      // If no graded comps, we can’t responsibly compute upside
      const haveGradedComps = (exp10 > 0 || exp9 > 0 || exp8 > 0);

      if (haveGradedComps) {
        const expectedGraded = round2((gp.psa10 * exp10) + (gp.psa9 * exp9) + (gp.psa8 * exp8));

        // Fees computed on graded resale
        const feesGraded = ebayFees(expectedGraded, cfg.ebayFeeRate, cfg.ebayFeeFixed);
        const gradeOut = round2(feesGraded + cfg.shippingOutFlat + cfg.suppliesFlat + gradingCosts(cfg));

        const profitGrade = round2(expectedGraded - gradeOut - totalIn);
        const roiGrade = totalIn > 0 ? profitGrade / totalIn : -1;

        // Only adopt grade-upside if it actually beats raw profit
        if (profitGrade > profitRaw) {
          dealType = "GRADE_UPSIDE";
          netProfit = profitGrade;
          roi = roiGrade;
          totalOut = gradeOut;
        }
      }
    }
  }

  const roiPct = roi * 100;
  const w = cfg.weights;

  let score =
    (netProfit * w.profit) +
    (roiPct    * w.roiPct) +
    (confidence * w.confidence) +
    (liquidity  * w.liquidity) +
    (isBIN ? w.binBonus : 0);

  if (listing.purchaseFormat === "AUCTION") score *= w.auctionMultiplier;

  return {
    listing,
    comp: compMain || null,
    dealType,
    expectedResale,
    totalCostIn: totalIn,
    totalCostOut: totalOut,
    netProfit,
    roi,
    confidence,
    liquidity,
    score: round2(score),
    gradePotential: gp
  };
}

/**
 * Eligibility check for alerts based on deal type thresholds
 * @param {import("./types.js").DealResult} deal
 * @param {import("./defaults.js").DEFAULTS} cfg
 */
export function passesThresholds(deal, cfg) {
  if (cfg.buyItNowOnly && deal.listing.purchaseFormat !== "BIN") return false;
  if (deal.listing.sellerFeedbackPct < cfg.sellerFeedbackMinPct) return false;
  if (cfg.requireReturns && !deal.listing.returnsAccepted) return false;

  const th = deal.dealType === "GRADED_FLIP"
    ? cfg.graded
    : cfg.raw;

  return (
    deal.netProfit >= th.minProfit &&
    deal.roi >= th.minROI &&
    deal.confidence >= th.minConf
  );
}
