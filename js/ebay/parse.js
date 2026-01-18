// Roi/js/ebay/parse.js
// Very simple v1 parser for manual data (we will improve in Build 2.5)

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
  if (t.includes("sar")) tags.push("sar");
  if (t.includes("secret rare")) tags.push("secret-rare");
  if (t.includes("illustration rare")) tags.push("illustration-rare");
  if (t.includes("trainer gallery") || /\btg\b/.test(t)) tags.push("trainer-gallery");
  return tags;
}

function conditionHint(title) {
  const t = title.toLowerCase();
  if (t.includes("damaged") || t.includes("dmg")) return "DMG";
  if (t.includes("hp") || t.includes("heavily played")) return "HP";
  if (t.includes("mp") || t.includes("moderately played")) return "MP";
  if (t.includes("lp") || t.includes("lightly played")) return "LP";
  if (t.includes("nm") || t.includes("near mint") || t.includes("mint")) return "NM";
  return "UNK";
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
  listing.parsed.rawConditionHint = listing.parsed.rawConditionHint !== "UNK"
    ? listing.parsed.rawConditionHint
    : conditionHint(title);

  // NOTE: cardName/setName parsing is intentionally minimal for now.
  // If user provides cardName/setName manually, we keep it.
  return listing;
}
