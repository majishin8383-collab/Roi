// core/gradePotential.js
import { clamp } from "./utils.js";

/**
 * Build GradePotential from signals.
 * Signals can come from:
 * - user input (manual sliders)
 * - later, CV outputs
 *
 * @param {Object} signals
 * @param {"LOW"|"MED"|"HIGH"} photoConfidence
 * @returns {import("./types.js").GradePotential}
 */
export function estimateGradePotential(signals = {}, photoConfidence = "LOW") {
  const s = {
    centeringFront: signals.centeringFront ?? null,
    centeringBack: signals.centeringBack ?? null,
    cornerRisk: signals.cornerRisk ?? null,
    edgeRisk: signals.edgeRisk ?? null,
    surfaceRisk: signals.surfaceRisk ?? null
  };

  const redFlags = [];

  // Defaults if missing (slightly pessimistic)
  const cornerRisk = clamp(s.cornerRisk ?? 0.35, 0, 1);
  const edgeRisk = clamp(s.edgeRisk ?? 0.30, 0, 1);
  const surfaceRisk = clamp(s.surfaceRisk ?? 0.25, 0, 1);

  // Centering penalty: ideal <= 0.60 (60/40). 0.55 (55/45) is better.
  function centerPenalty(x) {
    if (x == null) return 0.25;
    const v = Number(x);
    if (!Number.isFinite(v)) return 0.25;
    return clamp(Math.max(0, (v - 0.60) / 0.10), 0, 1);
  }

  const cpFront = centerPenalty(s.centeringFront);
  const cpBack = centerPenalty(s.centeringBack);
  const cp = (cpFront + cpBack) / 2;

  // riskIndex 0..1
  const r = 0.45 * cornerRisk + 0.35 * edgeRisk + 0.20 * surfaceRisk;
  const riskIndex = clamp(r + 0.6 * cp, 0, 1);

  if (cornerRisk >= 0.55) redFlags.push("Corner wear risk");
  if (edgeRisk >= 0.55) redFlags.push("Edge whitening risk");
  if (surfaceRisk >= 0.55) redFlags.push("Surface scratch/dent risk");
  if (cp >= 0.55) redFlags.push("Centering risk");

  // Map riskIndex -> probabilities (simple monotonic)
  let psa10 = clamp(0.75 - 0.85 * riskIndex, 0.00, 0.80);
  let psa9  = clamp(0.20 + 0.55 * riskIndex, 0.10, 0.85);
  let psa8  = clamp(1.00 - psa10 - psa9, 0.05, 0.60);

  // Normalize
  const sum = psa10 + psa9 + psa8;
  psa10 /= sum; psa9 /= sum; psa8 /= sum;

  return {
    photoConfidence,
    psa10,
    psa9,
    psa8,
    redFlags,
    signals: s
  };
}

/**
 * Compare photo confidence levels.
 */
export function isAtLeastConfidence(actual, min) {
  const order = { LOW: 0, MED: 1, HIGH: 2 };
  return (order[actual] ?? 0) >= (order[min] ?? 0);
}
