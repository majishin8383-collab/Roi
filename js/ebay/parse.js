// Roi/js/ebay/parse.js
// v1 parser: graded detection + cardNumber + tags + condition + MINIMAL name/set mapping

function pickGrade(title) {
  const t = title.toLowerCase();
  const m = t.match(/\b(psa|bgs|sgc)\s*([0-9]{1,2}(\.5)?)\b/);
  if (!m) return { grader: null, grade: null };
  return { grader: m[1].toUpperCase(), grade: Number(m[2]) };
}

function pickCardNumber(title) {
  const m = title.match(/\b(\d{1,3}\/\d{1,3})\b/);
  return m ? m[1] : null;
}

function tagify(title) {
  const t = title.toLowerCase();
  const tags = [];
  if (t.includes("alt art") || t.includes("alternate art")) tags.push("alt-art");
  if (/\bsar\b/.test(t)) tags.push("sar");
  if (t.includes("secret rare")) tags.push("secret-rare");
  if (t.includes("illustration rare")) tags.push("illustration-rare");
  if (t.includes("trainer gallery") || /\btg\b/.test(t)) tags.push("trainer-gallery");
  return tags;
}

function conditionHint(title) {
  const t = title.toLowerCase();
  if (t.includes("damaged") || t.includes("dmg")) return "DMG";
  if (t.includes("heavily played") || /\bhp\b/.test(t)) return "HP";
  if (t.includes("moderately played") || /\bmp\b/.test(t)) return "MP";
  if (t.includes("lightly played") || /\blp\b/.test(t)) return "LP";
  if (t.includes("near mint") || /\bnm\b/.test(t) || t.includes("mint")) return "NM";
  return "UNK";
}

/**
 * Minimal demo mapping so comps match and the pipeline proves out.
 * You can add more entries as you expand.
 */
function applyKnownMappings(listing) {
  const t = (listing.title || "").toLowerCase();

  // Demo 1: Charizard ex 215/198 (Obsidian Flames)
  if (t.includes("charizard ex") && t.includes("215/198")) {
    listing.parsed.cardName = listing.parsed.cardName || "Charizard ex";
    listing.parsed.setName = listing.parsed.setName || "Obsidian Flames";
    listing.parsed.cardNumber = listing.parsed.cardNumber || "215/198";
    if (!listing.parsed.tags?.includes("alt-art")) {
      listing.parsed.tags = [...(listing.parsed.tags || []), "alt-art"];
    }
    return;
  }

  // Demo 2: Pikachu V TG16/TG30 (Lost Origin)
  if (t.includes("pikachu v") && (t.includes("tg16/tg30") || t.includes("tg16"))) {
    listing.parsed.cardName = listing.parsed.cardName || "Pikachu V";
    listing.parsed.setName = listing.parsed.setName || "Lost Origin";
    listing.parsed.cardNumber = listing.parsed.cardNumber || "TG16/TG30";
    if (!listing.parsed.tags?.includes("trainer-gallery")) {
      listing.parsed.tags = [...(listing.parsed.tags || []), "trainer-gallery"];
    }
    return;
  }
}

export function parseListingInPlace(listing) {
  const title = String(listing.title || "");

  // Detect graded
  const { grader, grade } = pickGrade(title);
  if (grader && Number.isFinite(grade)) {
    listing.parsed.rawOrGraded = "GRADED";
    listing.parsed.grader = grader;
    listing.parsed.grade = grade;
  }

  listing.parsed.cardNumber = listing.parsed.cardNumber || pickCardNumber(title);
  listing.parsed.tags = Array.from(new Set([...(listing.parsed.tags || []), ...tagify(title)]));
  listing.parsed.rawConditionHint =
    listing.parsed.rawConditionHint !== "UNK"
      ? listing.parsed.rawConditionHint
      : conditionHint(title);

  // Minimal name/set mapping so comps match in manual mode
  applyKnownMappings(listing);

  return listing;
}
