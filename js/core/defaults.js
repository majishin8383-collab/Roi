// core/defaults.js

export const DEFAULTS = {
  // Costs (tune later)
  taxBufferRate: 0.00,
  suppliesFlat: 1.25,
  shippingOutFlat: 4.25,
  ebayFeeRate: 0.1325,
  ebayFeeFixed: 0.30,

  // Grading (placeholders - set these to your real costs)
  gradingFeeFlat: 18.00,
  gradingShipTo: 6.50,
  gradingShipBack: 6.50,
  gradingTimePenalty: 6.00,

  // Filters
  sellerFeedbackMinPct: 98,
  requireReturns: true,
  buyItNowOnly: true,

  // Thresholds
  raw:    { minProfit: 15, minROI: 0.25, minConf: 70 },
  graded: { minProfit: 25, minROI: 0.20, minConf: 75 },

  // Score weights
  weights: {
    profit: 2.2,
    roiPct: 1.3,
    confidence: 0.9,
    liquidity: 0.6,
    binBonus: 15,
    auctionMultiplier: 0.5
  },

  // Grade potential gating
  gradeUpside: {
    minPhotoConfidence: "MED",
    confMultiplier: { LOW: 0.0, MED: 0.5, HIGH: 1.0 }
  }
};
