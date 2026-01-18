// Roi/js/comp/config.js

export const COMP_CONFIG = {
  // Cloudflare Worker proxy (LIVE)
  proxyBase: "https://roi-worker.majishin8383.workers.dev",

  // Cache settings
  ttlMs: 6 * 60 * 60 * 1000, // 6 hours
  maxSoldPrices: 40,

  // Provider switch
  // "HTML" = Cloudflare Worker + eBay sold HTML (current)
  // "EBAY_API" = official eBay API (future)
  provider: "HTML"
};
