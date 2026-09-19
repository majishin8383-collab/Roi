# ROI Radar: current state

Updated: 2026-09-19. Source baseline inspected:
`38918eaaa02435e27f3432c2f4bb8a0a3308f116` on `main`.

## Current milestone
Run Radar -> retrieve one real listing -> retrieve verified matching sold-market
data -> existing ROI engine -> real deal card. Then verify three listings, then
add broad automatic discovery. A real result need not be profitable; never force
it to pass filters just to demonstrate success.

## Product requirements
Personal-use, Buy It Now first, raw and graded cards; broad discovery ranked by
net profitability, liquidity, and confidence. Future: vintage opportunities,
photo-based grading assessment, push alerts. Provider changes should not require
rewriting the engine. Facebook is optional. No category pivot was authorized.

## Verified repository behavior
- Mobile UI baseline is in index.html; preserve its layout and controls.
- js/app/testRadar.js contains real item URLs 287061434231, 287061434221,
  and 257316182464. Their current availability has not been verified.
- demoRunRadar calls the synchronous runManualRadar without any compMap.
- URL normalization creates 'MANUAL URL (add title later)' with price 0.
- A local execution with fetch instrumented recorded ZERO network calls. All
  three results had comp=null, netProfit=-5.80, ROI=-1 and failed default filters.
- js/comp/config.js names the Worker, but nothing imports/uses that configuration.
- There is no implemented live listing or sold-comp retrieval in this pipeline.
- Earlier controlled inputs demonstrated a scoring path, not validated live
  valuations. Residual demo mappings and a title-triggered grading heuristic
  remain in code; they are not actual card identification or photo analysis.
- Cost defaults are assumptions, including zero tax buffer; they must be reviewed
  before actionable purchase recommendations.

## Worker evidence
Endpoint: https://roi-worker.majishin8383.workers.dev

- User verified root returns OK on their phone.
- User opened /fetch for item 287061434231 and supplied a screenshot of an eBay
  'Something went wrong on our end' page, not usable listing data. Blocking is a
  plausible cause, not established by the screenshot alone.
- Requests from the assistant environment returned HTTP 403, Cloudflare error
  1010. This is a separate observation from the user's downstream eBay error.
- Repository js/worker.js always returns downstream HTML with HTTP 200, masking
  upstream status. Deployed source equivalence has not been verified.

## Data-source research (documentation only; no working integration)
- eBay publishes a production-access application process; access for this project
  has not been verified. No credentials have been provided or configured.
  https://developer.ebay.com/api-docs/buy/static/buy-requirements.html
- eBay lists Finding and Shopping APIs as decommissioned 2025-02-04. Do not use
  old completed-item tutorials as evidence of an available current endpoint.
  https://developer.ebay.com/develop/get-started/api-deprecation-status
- PriceCharting documents current values and yearly sales-volume, but explicitly
  excludes historic prices and historic sales from its Prices API/CSV. It does
  not directly satisfy the engine's sold-price samples and 30/90-day counts.
  https://www.pricecharting.com/api-documentation
- Published PriceCharting plans checked in this conversation: Collector $6/month
  includes a deal scanner; Legendary $49/month includes pricing API access.
  These are references, not purchases or a chosen provider. Recheck if needed.
  https://www.pricecharting.com/pricecharting-pro?f=api
- User explicitly reaffirmed building their own scanner. A competing scanner
  subscription is not the agreed next step. No spending was authorized.

## Completed in this change
Added AGENTS.md and this state record to prevent project drift. Documentation
only: application and Worker code have not been changed or deployed.

## Next executable action
Investigate free official access for BOTH active listings and sold history.
Resolve what the project can actually obtain before choosing a backend provider:
1. Confirm current listing API eligibility and whether the user already has an
   eBay developer account/production access; request only missing account access
   through supported secure mechanisms, never secret values in chat.
2. Establish whether a supported sold-data source provides exact card/grade
   matches, sale amounts, dates and measured sales counts. Document gaps explicitly.
3. Validate one real provider response, then implement the smallest adapter and
   explicit error handling that feed the existing engine and UI.

Blocked end-to-end: no verified live data source or provider credentials. Do not
declare the scanner operational. This does not authorize abandoning the goal.
