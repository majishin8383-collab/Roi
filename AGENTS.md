# ROI Radar: project instructions

## Objective
Build Joe's personal-use, automatic card-reselling scanner. Discover underpriced
cards broadly, match them to verified sold-market evidence, calculate net profit
and ROI after costs, evaluate liquidity and confidence, and rank opportunities.
The user decides what to buy. Profit and immediate resale are never guaranteed.

## Start every session
1. Read this file and PROJECT_STATE.md before proposing or editing code.
2. Inspect the current branch, working tree, and relevant existing files. Treat
   source code and observed results as evidence; do not assume old summaries are
   current. Preserve unrelated user edits.
3. State the current milestone and the concrete action that advances it.

## Scope and direction
- Current milestone: one real eBay listing plus verified matching sold data,
  passed through the existing engine and displayed as a real deal card.
- Keep the existing mobile Radar UI and engine architecture. Read exact files
  before modifying them; make focused changes, not replacement screens or
  speculative rewrites. Existing calculations can be fixed when evidence shows
  a defect; preserve unrelated behavior.
- Research data sources for THIS app, starting with free official options.
  Competitors may inform research; recommending a competing subscription is not
  completion of the task and is not a prerequisite for building this app.
- Do not switch categories, substitute manual card-by-card hunting for eventual
  broad discovery, or replace the owned app with a service without the user's
  agreement. Explain evidence and tradeoffs before proposing a change of goal.
- Defer Facebook, grading AI, vintage weighting, notifications, and visual
  redesign until the real-data milestone works. Preserve these future goals.
- Proceed with authorized research, inspection, focused fixes, and verification.
  Do not repeatedly ask permission for routine steps. Ask only for genuinely
  missing access/information, a changed objective, or unapproved spending or
  consequential external actions.

## Evidence and data integrity
- Separate observed behavior, tested code, proposals, estimates, and unknowns.
- No fake listings, invented sold comps, invented sales counts, or placeholder
  grading probabilities in live results. Clearly labeled test fixtures may be
  used in isolated tests.
- Do not treat missing price/shipping/data as verified zero cost. Missing sold
  evidence must produce an explicit insufficient-data state, not a buy signal.
- Match card identity, variant, condition, grading company and grade where
  relevant. Asking prices are not sold prices. Yearly sales volume is not a
  measured 30/90-day count. A price guide is not a set of individual sold comps.
- Verify provider access, fields, permitted use, cost, and a real response before
  promising an end-to-end integration. Do not bypass access controls.
- Keep credentials server-side and out of source, browser code, and chat output.
- Test the concrete risk introduced by a change. Do not claim live success from
  a mocked test or a Worker root returning OK.

## Finish each work session
- Update PROJECT_STATE.md with completed work, evidence, unresolved blockers,
  and the next executable action. Keep this file factual and concise.
- Report what changed, how it was verified, and whether it is local, committed,
  proposed in a PR, merged, or deployed. Never imply these are equivalent.
- Preserve work in version control. Do not merge or deploy without authorization.
- A blocker calls for focused investigation or a precise request for missing
  access, not reopening the entire strategy discussion.

If repository access is unavailable, follow the established fallback: obtain the
current file, modify that exact version, provide one complete replacement file,
then use the user's test result. Never ask the user to paste files already readable.
