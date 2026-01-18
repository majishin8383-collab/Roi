// Roi/js/ebay/normalize.js
// Manual import normalization (URL or lightweight object -> Listing shape)

function inferFormatFromTitle(title) {
  const t = String(title || "").toLowerCase();
  if (t.includes(" psa ") || t.includes("psa10") || t.includes("psa 10") || t.includes("bgs") || t.includes("sgc")) {
    return "GRADED";
  }
  return "RAW";
}

export function normalizeManualInput(input) {
  // input can be:
  // 1) string URL
  // 2) object { url, title, price, shipping, sellerFeedbackPct, returnsAccepted, ... }

  if (typeof input === "string") {
    return {
      itemId: `manual_${hashStr(input)}`,
      url: input,
      title: "MANUAL URL (add title later)",
      conditionText: "Unknown",
      purchaseFormat: "BIN",
      price: 0,
      shipping: 0,
      currency: "USD",
      sellerId: "unknown",
      sellerFeedbackPct: 100,
      sellerFeedbackCount: 0,
      returnsAccepted: true,
      locationCountry: "US",
      listedAtISO: new Date().toISOString(),
      imageUrls: [],
      parsed: {
        game: "pokemon",
        rawOrGraded: "RAW",
        cardName: null,
        setName: null,
        cardNumber: null,
        tags: [],
        grader: null,
        grade: null,
        rawConditionHint: "UNK"
      }
    };
  }

  const title = String(input.title || "");
  const rawOrGraded = input.rawOrGraded || inferFormatFromTitle(title);

  return {
    itemId: String(input.itemId || `manual_${hashStr(title + (input.url || ""))}`),
    url: String(input.url || ""),
    title,
    conditionText: String(input.conditionText || "Unknown"),
    purchaseFormat: String(input.purchaseFormat || "BIN"),
    price: Number(input.price || 0),
    shipping: Number(input.shipping || 0),
    currency: String(input.currency || "USD"),
    sellerId: String(input.sellerId || "unknown"),
    sellerFeedbackPct: Number(input.sellerFeedbackPct ?? 100),
    sellerFeedbackCount: Number(input.sellerFeedbackCount ?? 0),
    returnsAccepted: Boolean(input.returnsAccepted ?? true),
    locationCountry: String(input.locationCountry || "US"),
    listedAtISO: String(input.listedAtISO || new Date().toISOString()),
    imageUrls: Array.isArray(input.imageUrls) ? input.imageUrls : [],
    parsed: {
      game: "pokemon",
      rawOrGraded,
      cardName: input.cardName ?? null,
      setName: input.setName ?? null,
      cardNumber: input.cardNumber ?? null,
      tags: Array.isArray(input.tags) ? input.tags : [],
      grader: input.grader ?? null,
      grade: input.grade ?? null,
      rawConditionHint: input.rawConditionHint ?? "UNK"
    }
  };
}

function hashStr(s) {
  // tiny stable hash for ids (not crypto)
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
