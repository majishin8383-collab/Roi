// core/math.js
import { round2 } from "./utils.js";

/**
 * @param {number} price
 * @param {number} shipping
 * @param {number} taxBufferRate
 */
export function totalCostIn(price, shipping, taxBufferRate) {
  const base = (price || 0) + (shipping || 0);
  return round2(base + base * (taxBufferRate || 0));
}

/**
 * Approx eBay fees based on expected resale.
 * (We can refine by category later)
 */
export function ebayFees(expectedResale, feeRate, feeFixed) {
  return round2((expectedResale || 0) * (feeRate || 0) + (feeFixed || 0));
}

/**
 * Total cost out for a raw flip (fees + ship out + supplies)
 */
export function totalCostOutRaw(expectedResale, cfg) {
  const fees = ebayFees(expectedResale, cfg.ebayFeeRate, cfg.ebayFeeFixed);
  return round2(fees + cfg.shippingOutFlat + cfg.suppliesFlat);
}

/**
 * Grading costs bundle
 */
export function gradingCosts(cfg) {
  return round2(
    cfg.gradingFeeFlat +
    cfg.gradingShipTo +
    cfg.gradingShipBack +
    cfg.gradingTimePenalty
  );
}
