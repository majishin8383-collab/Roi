// Roi/js/app/testRadar.js
import { DEFAULTS, estimateGradePotential } from "../core/index.js";
import { runManualRadar, buildCompMap } from "../pipeline/runRadar.js";

export function demoRunRadar() {
  // 1) Manual inputs (you can paste URLs or objects)
  const inputs = [
    {
      url: "https://example.com/listing1",
      title: "Pokemon Charizard ex 215/198 Alt Art NM",
      price: 60,
      shipping: 4,
      sellerFeedbackPct: 99.4,
      returnsAccepted: true
    },
    {
      url: "https://example.com/listing2",
      title: "PSA 10 Pikachu V TG16/TG30 Lost Origin",
      price: 55,
      shipping: 5,
      sellerFeedbackPct: 98.2,
      returnsAccepted: true
    }
  ];

  // 2) Comps (for now you manually define them; later we automate comps)
  const compMap = buildCompMap([
    // RAW comp for Charizard ex
    {
      parsed: {
        game: "pokemon",
        rawOrGraded: "RAW",
        cardName: "Charizard ex",
        setName: "Obsidian Flames",
        cardNumber: "215/198",
        tags: ["alt-art"],
        grader: null,
        grade: null,
        rawConditionHint: "NM"
      },
      soldPrices: [110, 115, 118, 120],
      soldCount30d: 6,
      soldCount90d: 12
    },

    // PSA comps for Charizard ex (used only if gradePotentialFn returns a GP)
    {
      parsed: {
        game: "pokemon",
        rawOrGraded: "GRADED",
        cardName: "Charizard ex",
        setName: "Obsidian Flames",
        cardNumber: "215/198",
        tags: ["alt-art"],
        grader: "PSA",
        grade: 10,
        rawConditionHint: "UNK"
      },
      soldPrices: [220, 230, 240],
      soldCount30d: 3,
      soldCount90d: 8
    },
    {
      parsed: {
        game: "pokemon",
        rawOrGraded: "GRADED",
        cardName: "Charizard ex",
        setName: "Obsidian Flames",
        cardNumber: "215/198",
        tags: ["alt-art"],
        grader: "PSA",
        grade: 9,
        rawConditionHint: "UNK"
      },
      soldPrices: [150, 155, 160],
      soldCount30d: 5,
      soldCount90d: 10
    },
    {
      parsed: {
        game: "pokemon",
        rawOrGraded: "GRADED",
        cardName: "Charizard ex",
        setName: "Obsidian Flames",
        cardNumber: "215/198",
        tags: ["alt-art"],
        grader: "PSA",
        grade: 8,
        rawConditionHint: "UNK"
      },
      soldPrices: [120, 125],
      soldCount30d: 2,
      soldCount90d: 5
    },

    // GRADED comp for Pikachu PSA 10 (simple)
    {
      parsed: {
        game: "pokemon",
        rawOrGraded: "GRADED",
        cardName: "Pikachu V",
        setName: "Lost Origin",
        cardNumber: "TG16/TG30",
        tags: ["trainer-gallery"],
        grader: "PSA",
        grade: 10,
        rawConditionHint: "UNK"
      },
      soldPrices: [85, 90, 92, 88],
      soldCount30d: 6,
      soldCount90d: 14
    }
  ]);

  // 3) Grade Potential (for now: stubbed HIGH for the Charizard)
  const gradePotentialFn = (listing) => {
    const t = listing.title.toLowerCase();
    if (t.includes("charizard ex") && t.includes("215/198")) {
      return estimateGradePotential(
        { centeringFront: 0.56, centeringBack: 0.57, cornerRisk: 0.20, edgeRisk: 0.20, surfaceRisk: 0.20 },
        "HIGH"
      );
    }
    return null;
  };

  return runManualRadar(inputs, { cfg: DEFAULTS, compMap, gradePotentialFn });
}
