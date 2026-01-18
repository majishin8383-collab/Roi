// core/types.js
// JSDoc typedefs only (no runtime logic). Safe to import anywhere.

/**
 * @typedef {Object} ParsedCardInfo
 * @property {"pokemon"} game
 * @property {"RAW"|"GRADED"} rawOrGraded
 * @property {string|null} cardName
 * @property {string|null} setName
 * @property {string|null} cardNumber
 * @property {string[]} tags
 * @property {string|null} grader
 * @property {number|null} grade
 * @property {"NM"|"LP"|"MP"|"HP"|"DMG"|"UNK"} rawConditionHint
 */

/**
 * @typedef {Object} Listing
 * @property {string} itemId
 * @property {string} url
 * @property {string} title
 * @property {string} conditionText
 * @property {"BIN"|"AUCTION"} purchaseFormat
 * @property {number} price
 * @property {number} shipping
 * @property {string} currency
 * @property {string} sellerId
 * @property {number} sellerFeedbackPct
 * @property {number} sellerFeedbackCount
 * @property {boolean} returnsAccepted
 * @property {string} locationCountry
 * @property {string} listedAtISO
 * @property {string[]} imageUrls
 * @property {ParsedCardInfo} parsed
 */

/**
 * @typedef {Object} CompStats
 * @property {string} key
 * @property {number[]} soldPrices
 * @property {number} p25
 * @property {number} p50
 * @property {number} p75
 * @property {number} varianceRatio
 * @property {number} soldCount30d
 * @property {number} soldCount90d
 */

/**
 * @typedef {Object} GradePotential
 * @property {"LOW"|"MED"|"HIGH"} photoConfidence
 * @property {number} psa10
 * @property {number} psa9
 * @property {number} psa8
 * @property {string[]} redFlags
 * @property {Object} signals
 * @property {number|null} signals.centeringFront
 * @property {number|null} signals.centeringBack
 * @property {number|null} signals.cornerRisk
 * @property {number|null} signals.edgeRisk
 * @property {number|null} signals.surfaceRisk
 */

/**
 * @typedef {Object} DealResult
 * @property {Listing} listing
 * @property {CompStats|null} comp
 * @property {"RAW_FLIP"|"GRADE_UPSIDE"|"GRADED_FLIP"} dealType
 * @property {number} expectedResale
 * @property {number} totalCostIn
 * @property {number} totalCostOut
 * @property {number} netProfit
 * @property {number} roi
 * @property {number} confidence
 * @property {number} liquidity
 * @property {number} score
 * @property {GradePotential|null} gradePotential
 */
export {};
