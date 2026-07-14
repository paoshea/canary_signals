# Instability Watch — Master Ideas Document

**Compiled:** 6 July 2026 · **Revised:** 12 July 2026 (Parts XVI–XVIII added — July exhibits #109–134; scour escalations & contradictory evidence #135–145; execution layer #146–148)
**Scope:** Every analytical idea, indicator, metric, mechanism, data source, and research reference developed across the full working session, with a value and applicability comment on each.
**Status convention:** Value = analytical worth of the idea. Applicability = how readily it can be implemented today (data availability, cost, frequency).

---

## Part I — Core Philosophy

### 1. Rate of change precedes level (the founding thesis)
Levels tell you where you are; first derivatives tell you where you're going; second derivatives tell you whether deterioration is accelerating. Every major crash had levels that looked fine until velocity in an underlying variable went vertical. HY spreads were ~250bps in early 2007 and the *widening rate* in autumn 2007 was the canary — the level didn't confirm until the crisis was fully underway.
**Value:** Foundational — everything else in the framework derives from it. **Applicability:** Universal; costs nothing to adopt; requires only computing RoC and acceleration columns on every series already tracked.

### 2. Count canaries, never wait for the last one
Multiple moderate deteriorations outweigh one extreme reading. VIX 28 + HY +120bps/5d + A/D divergence + TED >50bps is a regime trigger; VIX 35 alone is noise.
**Value:** High — prevents the single-indicator fixation that cost investors the 2007 warning window. **Applicability:** Immediate; it is a scoring rule, not a data requirement.

### 3. Divergence between causal groups is the primary signal (not any single reading)
Four groups that must never be averaged into one composite: **A Leverage** (slow-building, violent unwind), **B Credit & Liquidity** (fastest actionable once turning), **C Rates & Inflation** (slow, highest eventual hit-rate), **D Vol/Breadth/Sentiment** (fast, least predictive alone). A composite erases the only information that matters — which layer is stressed and whether layers agree. A-red/D-green is the 2000 and 2007 pre-crash signature; B flipping while A is red and D green is historically the fastest, sharpest warning (Aug 2007). A D-only shock with A/B/C green (Aug 2024) mean-reverts.
**Value:** The single most decision-relevant construct in the framework. **Applicability:** Immediate once group membership is assigned; the current readings already support it (A red, B green, C amber, D green — gap at maximum for ~20 months).

### 4. Why a single composite score is rejected
Indicators differ in units, frequency, and causal layer. A composite looks reassuring whenever leverage screams but credit is calm — precisely the false comfort the framework exists to prevent — and destroys the information about which lever to pull.
**Value:** High as a design principle. **Applicability:** A decision already embedded in the architecture.

### 5. Layered architecture (the full stack)
Layer 1 Macro Context (interpretive weights) → Layer 2 Bubble Percentile (magnitude) → Layer 3 Divergence (primary signal) → Layer 4 Canary categories (thresholds) → Layer 5 Market Structure Integrity (propagation mechanics) → Layer 6 Extended Correlation Network (earliest, most indirect signals).
**Value:** High — separates "what is moving" from "why it matters," "how much it matters," and "how it will propagate." **Applicability:** Fully specified; implemented in the dashboard artifacts; production wiring is the remaining work.

---

## Part II — The Original Ten Early-Warning Indicators

Each is a velocity/second-derivative reformulation of a familiar metric.

### 6. Yield curve re-steepening speed (not just inversion)
Rapid steepening from deep inversion (>+30bps/30d) signals recession arrival, not recovery — the Fed cutting into a recession already underway (1989, 2000, 2006-07).
**Value:** High; the "re-steepening trap" is widely misread as bullish. **Applicability:** Immediate — FRED DGS2/DGS10/TB3MS, free, daily.

### 7. Credit spread second derivative
Acceleration of widening off a low base (300→350bps moving faster than 350→400) leads equity drawdowns; caught 1998 and 2007 early.
**Value:** Very high — the fastest genuinely actionable warning in the set. **Applicability:** Immediate — FRED BAMLH0A0HYM2, free, daily.

### 8. Margin debt growth vs market-cap growth
Leverage outrunning the asset base supporting it (flashed 1999-2000, 2007; currently 1.54× since 1997, +53.7% YoY, 4.1% of GDP — all-time high).
**Value:** Very high — currently the loudest reading on the whole panel. **Applicability:** Immediate — FINRA monthly, free, ~30-day lag.

### 9. M2 growth deceleration/turn (not level)
12-18 month leading liquidity signal; the 2022 contraction (first since the Depression) was textbook. Currently re-accelerating (~4.6%) — a near-term tailwind that seeds the next inflation problem.
**Value:** High, slow-moving, high-conviction. **Applicability:** Immediate — FRED M2SL, monthly, free.

### 10. SLOOS tightening velocity
Speed of QoQ tightening in bank lending standards led the 1990 and 2008 recessions by 2-4 quarters. Currently modest on C&I; **NDFI (shadow-bank) standards tighter across all categories** — the newer risk channel.
**Value:** High; the NDFI cut is the modern refinement. **Applicability:** Immediate — Fed quarterly, free, ~6-week lag.

### 11. VIX term-structure backwardation
Near-dated fear exceeding longer-dated is the acute-stress signature (1987, 2008, 2020, Aug 2024).
**Value:** High as a confirming trigger; poor as a standalone lead. **Applicability:** Immediate — ^VIX vs ^VIX3M, free, daily.

### 12. Breadth deterioration velocity
The *rate* at which participation narrows while the cap-weighted index grinds higher (1999-2000, 2007).
**Value:** High. **Applicability:** Moderate — needs constituent-level computation (Polygon/EODHD); flagged as the highest-priority unverified Tier-1 category.

### 13. Funding-market plumbing velocity (TED, FRA/OIS, repo, CP, cross-currency basis)
Sudden moves relative to policy rates mark the arrival of systemic stress. TED >100bps in Aug 2007 was the first GFC canary — thirteen months before Lehman.
**Value:** The most consequential category once it fires. **Applicability:** Mostly immediate via FRED; SOFR-era TED equivalent needs minor construction; cross-currency basis is the one genuinely hard-to-source row (Bloomberg).

### 14. Retail speculative call-volume growth rate
MoM acceleration in small-account call buying (early 2000, late 2021).
**Value:** Medium-high. **Applicability:** Moderate — OCC/CBOE data exists; small-trader cut requires some assembly.

### 15. Foreign reserve/Treasury-flow deceleration
Rate-of-change in foreign official accumulation (1997-98 Asia; today's Japanese/Chinese UST holdings deceleration).
**Value:** High, structural. **Applicability:** Immediate — TIC data, monthly, free, lagged.

---

## Part III — Additions From the SYSTEMIC_RISK_MONITORING.md Merge

### 16. The 40-canary threshold matrix (volatility, credit, breadth, structure, rates, liquidity, cross-asset, positioning, inflation)
Explicit level / RoC / second-derivative triggers for every indicator (e.g., HY canary >500bps level, >100bps/10d RoC, 3-week acceleration; VIX >30/>40, >50%/5d; 10Y >5.0%, +100bps/60d, three consecutive larger monthly rises).
**Value:** Very high — converts our concepts into an operational rulebook. **Applicability:** Immediate for the ~23 canaries on free Tier-1 data; tiered plan covers the rest.

### 17. Macro Layer vs Regime Layer distinction (Section 5.3)
"The 10Y is 4.35%" is descriptive; "+280bps in 9 months, each 30-day window larger than the last" is actionable. The 2022 acceleration-streak fired January 2022 — *before* the Jan 4 equity peak.
**Value:** Very high; sharpened our own Group C thinking. **Applicability:** Immediate — computed fields on already-ingested DGS10.

### 18. Gaps we identified and fixed in the source doc
(a) No balance-sheet leverage category at all — margin debt invisible to all 9 live checks; (b) M2 absent despite the doc's own inclusion logic; (c) SLOOS absent despite clearing the stated free-FRED bar; (d) 31-vs-40 count inconsistency (editorial). All were subsequently accepted and folded into the canonical doc as canaries 41-45 plus corrections.
**Value:** High — the leverage blind spot was the difference between detecting and missing the current configuration. **Applicability:** Done (Track A complete); live wiring deferred (Track B / SR-01) with a defined trigger condition.

### 19. Historical calibrations embedded as evidence
2007-08 credit/TED sequence; 2022 CPI acceleration table (streak fired Jan '22); Sep 2019 repo (reserves ~$1.5T, repo to 10%); Aug 2024 yen-carry (JPY velocity → 7% SPX in 3 days); March 2023 MOVE >180 preceding SVB fallout.
**Value:** High — every threshold is anchored to an episode, not invented. **Applicability:** Already embedded; also drives the Case Studies page.

---

## Part IV — New Canaries From News-Flow Analysis (Rounds 1-2)

### 20. Single-stock leveraged ETF AUM growth
Concentrated, self-reinforcing leverage (CSOP 2× SK Hynix ETF; a 13.2% fall = 26.4% fund loss) invisible to margin-debt statistics. Regulators publicly regretting their own product approvals is a second-order tell in itself.
**Value:** High — a structural feature of 2025-26 with no 2000/2007 analogue. **Applicability:** Good — ETF AUM/flows are public; Tier 2.

### 21. Sector index extension above its own 200dMA, in percentile terms
The SOX more overbought vs its 200dMA than at the dot-com peak. Distinct from breadth (how many stocks participate) — this is how far the leading index has detached from its own trend.
**Value:** High; cheap and sharp. **Applicability:** Immediate — computable from price data already held.

### 22. Sector-concentrated private/direct credit growth
SaaS direct lending $8B (2015) → $538B (2025), 67× in a decade — leverage invisible to margin debt, SLOOS, and HY spreads until it breaks.
**Value:** High as a named blind spot even where instrumentation is hard. **Applicability:** Limited — non-standardized data (PitchBook/press); Tier 3; issuance-rate proxies partially trackable.

### 23. Sector rotation / concentration velocity
Capital crowding into AI-infrastructure at an accelerating rate (top-5 share of sector cap and its RoC) — a sharper cousin of equal-weight-vs-cap-weight.
**Value:** Medium-high. **Applicability:** Good — computable from constituent data; Tier 2.

### 24. Foreign positioning reversal as a *bottoming* (contrarian) canary
India: MSCI EM weight 20%→<12%, record outflows against 7.7% GDP growth — a positioning/fundamentals disconnect marking capitulation, not risk. The framework should track disconnects in both directions.
**Value:** Medium — broadens the framework from top-detection to cycle-position detection. **Applicability:** Moderate — MSCI weights + flow data.

### 25. Tranched-round blended-valuation opacity (disclosure degradation as a canary class)
$11M at $55M pre-money, then $1.1B at $4B pre-money within a month; only the headline tranche reported. "A billion-dollar headline is worth a lot more than an accurate one." Rule: **when financing structures evolve to make price discovery harder on purpose, that evolution is itself a canary** (1999's pro-forma metrics; 2006's CDO opacity).
**Value:** Very high conceptually — names a whole class the quantitative framework can't see. **Applicability:** Qualitative; proxy = frequency of >10× intra-round step-ups (PitchBook/press); Tier 3.

### 26. Meme reactivation in unrelated/declining names (price-to-volume fragility)
Wendy's +26% on $2.2M of buying, down 72% from highs — speculation untethered from any narrative, later-stage and more indiscriminate than thesis-driven AI froth; also a liquidity-fragility measurement (tiny flow, outsized move). 2021 analogue sat at a top.
**Value:** High, dual-purpose (sentiment + microstructure). **Applicability:** Good — price/volume screens are cheap; Tier 2.

### 27. Multi-instrument rapid capital raising by bubble-marquee names
SpaceX $86B IPO followed by a $25B bond inside ~90 days (Allianz CIO: "bubble territory"). Repeated raising across instrument types in a short window marks peak funding indiscriminateness.
**Value:** High as a cycle-maturity marker. **Applicability:** Qualitative; deal-flow monitoring; Tier 2-3.

---

## Part V — The Central-Banker / Transmission-Mechanism Layer (Macro Context)

### 28. r* decomposition of yield moves
Yields rising because r* rose (productivity — benign) vs because term premium rose (fiscal — a tightening canary). With HLW r* at ~1.5-2.0%, a 5% 10Y may be near-neutral, not restrictive. Canary row: real 10Y minus estimated r*, attributed to the side that moved.
**Value:** Very high — changes the meaning of every Category 5 reading. **Applicability:** Immediate — NY Fed/Cleveland Fed publish r* estimates quarterly, ACM term premium daily, free.

### 29. Productivity-into-potential-output check (unit labor costs)
If output per worker outruns wages, apparent "overheating" isn't inflationary (Greenspan 1996-98). Ground truth = unit labor costs (BLS quarterly, free). Currently productivity > wages in AI-exposed sectors — locally disinflationary.
**Value:** High — the false-positive filter for the whole Inflation category. **Applicability:** Immediate.

### 30. Earnings-quality decomposition (EPS growth vs P/E expansion share of returns)
When >70% of trailing returns come from multiple expansion, compression risk is asymmetric; productivity-driven earnings tell a different story at the same price.
**Value:** High. **Applicability:** Good — computable from public EPS/index data; flagged for live wiring.

### 31. The deflationary productivity shock scenario (1870-1900 analogue)
Broadening AI productivity could produce falling price levels with strong real growth and savage asset-price deflation in disrupted sectors — a regime the entire Inflation category has no calibration for. Explicitly logged as an open framework risk.
**Value:** High as intellectual honesty — knowing where the framework itself breaks. **Applicability:** Watch-item; trigger = CPI falling while real growth stays elevated.

### 32. Three productivity scenarios as regime weights
A Inflationary (canaries fire correctly), B Disinflationary (raise CPI thresholds, treat 5% 10Y as neutral), C Deflationary shock (Category 9 uncalibrated). The macro layer *re-weights* canaries; it never fires them.
**Value:** High. **Applicability:** Immediate as an interpretive rule.

---

## Part VI — Passive-Flow Mechanics & Market Structure (Layer 5)

### 33. BIG cap-weight concentration premium
Mechanical excess return to the largest stocks from cap-weighted flow (~4-5%/yr; trend slope +0.33%/yr², t=+2.79 — accelerating). Q1 2026 partial at ~-4.5% is the first significant negative since 2022. Canary: two consecutive negative years = flow reversal confirmed.
**Value:** Very high — quantifies the "fire hose into a crowded theatre." **Applicability:** Good — computable quarterly from constituent returns.

### 34. The passive circularity loop (flow → weight → more flow) and the multiple-application problem
Flow creates the valuation, the valuation creates the earnings target, the target justifies the flow — with analysts applying multiples to flow-inflated bases. Vendor-finance in equity-market-structure form: the index fund is simultaneously price-setter and price-validator, so no third party discovers the price.
**Value:** Very high conceptually. **Applicability:** Monitored via #33, #36, #37 rather than directly.

### 35. Gabaix-Koijen inelastic markets ($1 flow ≈ $5 market value)
The academic quantification of why passive flows have outsized price impact — and why redemption selling is symmetric and cap-weight-proportional into whatever liquidity exists.
**Value:** Very high — the theoretical spine of Layer 5. **Applicability:** Free (NBER w28967); informs design rather than a data feed.

### 36. Demographic flow reversal (401K decumulation)
Boomer drawdown ends the 40-year accumulation tailwind at the margin (labor force -700K in June 2026 as a symptom). Doesn't crash markets; removes the volatility-suppressing marginal buyer — consistent with structurally higher baseline vol.
**Value:** High, slow, structural. **Applicability:** Immediate — ICI quarterly flow data, free.

### 37. IPO float supply vs passive absorption capacity
Mega-IPOs (SpaceX $86B) force index buying; canary when quarterly float supply exceeds marginal passive inflows — "the fire hose becomes a vacuum." Most plausible first-mover unwind channel.
**Value:** High. **Applicability:** Good — IPO calendar vs ICI weekly flows.

### 38. Implied correlation vs VIX divergence (WP-04)
COR3M depressed while VIX elevated = the options market pricing "something big, but we don't know which stocks" — the signature of structural/flow risk, and the condition under which every optimizer is fed correlation inputs that understate systemic risk simultaneously. Mid-2007 and late-2018 precedents; correlation spikes are visible in *volume* co-movement 1-2 days before they print in returns.
**Value:** Very high — the sharpest new quantitative canary of the session. **Applicability:** Immediate — CBOE COR3M free, daily; threshold specified (COR3M <20 while VIX >20 for >15 days).

### 39. Optimizer fragility / "smooth line" critique
Mean-variance optimization assumes correlation stability; the smooth line fails precisely in the events this framework detects, because diversification evaporates when correlations spike to 1. Connects retail "optimization model" content to WP-04.
**Value:** Medium-high as interpretation. **Applicability:** Embedded in #38's rationale.

### 40. Unwind channel map (four mechanisms, ordered)
(A) IPO supply overwhelms passive absorption; (B) redemption-driven proportional selling amplifying the largest names; (C) simultaneous earnings misses in the concentrated few hitting extreme weights; (D) the slow demographic bleed. Japan 1989-90 — not 2000 — is the closest analogue, because the most systemically important names were simultaneously the most overvalued and the most interconnected.
**Value:** High — converts "bubble" into testable propagation paths. **Applicability:** Each channel maps to a monitored row (#33, #36, #37, Cat-3 concentration).

### 41. Total Portfolio Approach as an amplifier (AQR)
Institution-level holistic allocation rebalances more dynamically than mandate-constrained funds — potentially amplifying stress responses as TPA spreads.
**Value:** Medium. **Applicability:** Contextual.

---

## Part VII — AI Supply-Chain Systemic Risk (Category 12/13)

### 42. The circular revenue identity
Hyperscalers fund OpenAI/Anthropic → labs buy hyperscaler compute → hyperscalers book AI revenue. The labs are ~68-75% of reported ecosystem "AI revenue" and 50%+ of hyperscaler RPOs (~$748B). OpenAI: $17.2B Azure spend in a year of -$20.9B losses on ~$13B revenue. Telecom vendor finance (Lucent/Nortel) is the structural analogue — both sides collapse together.
**Value:** Very high — the fundamental fragility beneath the concentration. **Applicability:** Trackable via #43-#46; the identity itself is established from filings/court records.

### 43. Hyperscaler FCF-vs-capex crossing (the dateable catalyst)
BIS: capex exceeds free cash flow as of Q3 2026 for the five largest. **August-October 2026 earnings season is the first hard data point** — the highest-priority calendar entry in the framework.
**Value:** Very high — a rare *dated* canary. **Applicability:** Immediate at each earnings release; four filings a quarter.

### 44. RPO concentration and restatement watch
Any renegotiation/delay/restructuring of a major compute commitment (SoftBank's delayed $20B tranche is a partial instance) converts contracted backlog into headline risk.
**Value:** High. **Applicability:** Immediate — 10-K/10-Q disclosures.

### 45. Single-counterparty debt concentration in the supply chain
Oracle ($129.5B debt, -$23.7B FCF, $260B unsigned leases, $340B Stargate build for one customer); CoreWeave (65% single-customer revenue). Revenue concentration >50% in a loss-making counterparty = red for any systemically significant supplier.
**Value:** Very high. **Applicability:** Immediate for public names; private neoclouds partial.

### 46. Collateral refusal as revealed preference
Banks declining a $6B margin loan against SoftBank's >$100B paper OpenAI stake — lenders with full information pricing the stated valuation as unfinanceable. Rule: **unfinanceable at any meaningful LTV ⇒ the stated valuation is not the true valuation.**
**Value:** Very high — the single most powerful qualitative datum of the session. **Applicability:** Event-driven; leaks reliably to press.

### 47. AI revenue disclosure-quality degradation
Zero GAAP AI segment disclosure across the Mag-7; run-rate language only. Monitoring: count run-rate vs GAAP-segment language per earnings season; a rising count over four quarters is the canary. Same move as 1999's eyeballs and 2006's tranching: degrade the measurement on purpose.
**Value:** High. **Applicability:** Good — transcripts are free; simple NLP.

### 48. SDLLMTK — LLM token expenditure index (the demand truth serum)
Bloomberg ticker SDLLMTK; Silicon Data API with frontier/open-weight split. $1.66/M tokens, -20% from the May 2026 high. Scenario A (Jevons: price falls, volume rises — bullish infra) vs Scenario B (plateau: price falls, volume flat — capex justification breaks); the segment split distinguishes them. Thresholds: amber -10%/20d with spread narrowing; red -20%/30d with frontier volume falling. Currently at the amber/red boundary.
**Value:** Very high — the only *daily, real-economy* demand read on the trillion-dollar capex story. **Applicability:** Immediate with Bloomberg; API for the split.

### 49. Compute futures forward curve (CME × Silicon Data)
Once liquid, a market-priced forward view of compute demand 3-12 months out — the oil-curve equivalent for AI.
**Value:** Potentially the best future Category-12 lead. **Applicability:** Not yet — monitor market development.

### 50. AI capex narrative contagion into infrastructure (with the lag)
Pipelines/utilities/power (MPLX et al.) priced for data-center demand. Telecom-1999 lag structure: infrastructure peaks 6-18 months *after* the tech peak, so these names can masquerade as safe-haven rotations early in a tech selloff before the second-order drawdown.
**Value:** High — the lag insight upgrades it from observation to tradeable structure. **Applicability:** Monitoring rule defined (infra underperformance after tech has corrected).

---

## Part VIII — OpEx Mechanics, Volume, and the Conviction Lens

### 51. OpEx pinning / release cycle
Dealer hedging pins price to max-pain strikes into expiry (volume collapse confirms mechanical); post-expiry release on day 1; day 2-3 volume acceleration reveals whether genuine participants joined. Quarterly witching (Mar/Jun/Sep/Dec) is ~10× monthly gamma; the post-quarterly window shows elevated realized vol.
**Value:** High. **Applicability:** Immediate for the calendar/threshold logic; GEX inputs semi-proprietary (SpotGamma summaries).

### 52. OpEx as temporal amplifier, not standalone canary
Negative dealer gamma + flat/inverted VIX term structure *into* quarterly OpEx ⇒ treat the following 5-10 days as one canary level higher than static readings. Given A-red/D-green, **September 19, 2026** is the flagged high-watch window.
**Value:** High — adds a time dimension the framework otherwise lacks. **Applicability:** Immediate as a rule.

### 53. VCI — Volume Conviction Index (novel per-ticker metric)
`VCI = 5-day momentum % × ln(volume ratio + 1) × sign`. High |VCI| = conviction (persistence likely); ≈0 on a big move = mechanical (reversion likely). Kyle-lambda intuition operationalized as a daily per-ticker score. Extensions specified: per-ticker percentile vs own history; post-catalyst decay curves; cross-ticker VCI correlation (simultaneous conviction across AI names = systemic); pre-OpEx suppression as pinning confirmation.
**Value:** Very high — the session's most original quantitative construction. **Applicability:** Immediate — needs only OHLCV; prototyped in the Conviction Lens.

### 54. Volume pattern taxonomy around events
(1) Volume collapse into expiry = pinning confirmation; (2) options-to-stock volume ratio spike = derivatives-driven price action; (3) post-event day-2/3 volume acceleration = conviction joining (2022 drawdown legs); (4) dark-pool share rising into OpEx in Mag-7 = institutional distribution using the mechanical bid as cover (FINRA ATS, free, lagged).
**Value:** High — the volume side is less arbitraged than the price side. **Applicability:** Good; dark-pool row needs a dedicated weekly monitor.

### 55. Per-ticker volume × price × momentum × catalyst timeline (the Conviction Lens)
A chart type that doesn't exist as a standard tool: annotated catalysts (earnings/OpEx/macro/guidance/debt/analyst) over synchronized price, volume-ratio-colored bars, and VCI, with an interactive catalyst log. Built as a working prototype on sample data (NVDA/ORCL/KKR).
**Value:** High — genuinely novel presentation with analytical content, not decoration. **Applicability:** Prototype done; production needs a live OHLCV feed and a catalyst database.

### 56. Hold-the-dip discipline (AQR) applied to VCI
Trend-following beats dip-buying empirically; therefore high negative VCI is respected as trend, not auto-faded — the counterweight to naive mean-reversion framing.
**Value:** Medium-high as an interpretation rule. **Applicability:** Immediate.

---

## Part IX — Retail-Content & Sentiment Canaries (qualitative, graduated)

### 57. Retail content proliferation vs macro-risk ratio
Single-asset "why I like X" content proliferating at the exact moment the aggregate picture (Disruptors ~975) is most extreme, with none of it referencing that context — the 1999-2000 pattern. Monitor: rolling 90-day ratio of single-asset recommendation content to macro-risk content in retail media.
**Value:** High — the session's meta-observation made operational. **Applicability:** Qualitative but systematic; graduated to an active red row.

### 58. Alt-asset-manager July seasonality as an *inverse* signal
KKR/CG/ARES/BX carry 100% positive July hit-rates over 10 years, tied to Q2 private-asset marks. **Underperformance >3% vs the historical July median = private-credit stress pricing before reported marks.** The table itself is also Exhibit A of the risk-free-framing genre (#57) — it would have looked identical in June 2007.
**Value:** High — a creative reuse of promotional content as a stress detector. **Applicability:** Immediate each July; trivially computable.

### 59. Smoothed private-asset returns as illusion of safety (Asness/AQR)
Private credit's reported low correlation is partly stale-mark artefact; correlation snaps to 1 exactly when it matters — validating NDFI rows as *leading*, not coincident.
**Value:** High. **Applicability:** Interpretive; already embedded.

### 60. Rejections worth recording
Generic mean-reversion framing (no latent process — rejected by the intake filter); the "market makers push prices down to kill options" narrative (mechanism wrong; the real content is dealer gamma hedging, already canary 31); gold miners as an income strategy (yields don't clear platform thresholds). Documented so they aren't re-litigated.
**Value:** Medium — negative results prevent recycling. **Applicability:** Done.

### 61. Gold regime flag (rate-sensitive vs fear mode)
Gold at its 200dMA on USD/rates pressure = rate-sensitive mode (current); the fear canary needs gold +5% while SPX -5% in the same window. Central-bank buying (elevated since 2022) is the structurally significant row — reserve managers de-risking the dollar before markets price it.
**Value:** Medium-high. **Applicability:** Immediate — free daily data.

---

## Part X — Bubble Percentile Layer (Layer 2)

### 62. The BofA standardized bubble comparison (1977-2026)
Gold '80 (peak 500), Japan '89 (450), Asia '97 (320), Tech '00 (650), Housing '07 (640), China '07 (380), Biotech '15 (540) — all reverted 63-80%. **Disruptors '26 at ~950-1000**, 50% above the highest prior peak.
**Value:** Very high — turns "bubble" from adjective into percentile. **Applicability:** Chart is published; the composite (NYFANG+DJCOM equal-weight) is replicable monthly.

### 63. Reversion distance as a magnitude (not timing) signal — WP-03
Reaching the average prior trough (~150) implies ~85% reversion — further than any prior bubble fell from its own peak. Orthogonal to canary state: canaries say *what's moving*; this says *how much a move can matter*. Rule: canary weights scale with bubble percentile (a Group-B flip at the 99th percentile deserves 2-3× the de-risking of the same flip at the 50th).
**Value:** Very high — the cleanest articulation of why "this time the same signal means more." **Applicability:** Immediate as a weighting rule.

### 64. Ascent-velocity evidence (Greenwood-Shleifer-You)
Industry cap doubling in two years ⇒ ~40% crash probability within two years, rising with speed; the Disruptors halved in '22 and then tripled — each recovery extends the ultimate reversion distance.
**Value:** High — peer-reviewed backing for the velocity logic. **Applicability:** Free (NBER); embedded.

### 65. Shiller CAPE as the long Layer-2 series
US CAPE in the top ~5% of post-1881 history; free monthly download.
**Value:** High. **Applicability:** Immediate.

---

## Part XI — Extended Correlation Network (Layer 6)

Design rule: score each series on **causal distance × lead time × frequency × uniqueness**; the prize is distant + long-lead + high-frequency + unique. Flag on RoC thresholds that historically preceded primary-canary activation by the series' characteristic lead.

### 66. Semiconductor book-to-bill (SEMI, monthly, free)
Falling from >1.0 toward 1.0 led semi earnings misses by 2-3 quarters — directly upstream of the AI-hardware complex. **Currently red.**
**Value/Applicability:** Very high / immediate. Arguably the best single Layer-6 row for this cycle.

### 67. Corporate guidance-language NLP (RoC of hedging phrases per call)
"Uncertain / limited visibility / monitoring closely" frequency accelerating while results are still good = 2-3 quarter lead. **Currently red.**
**Value/Applicability:** High / good — transcripts free, simple counting.

### 68. VC down-round frequency
Private stress → LP confidence → funding drought → tech employment → spending; loaded further by tranched-round opacity masking true marks. **Currently red.**
**Value/Applicability:** High / moderate (PitchBook; press proxies).

### 69. Baltic Dry Index (daily, free) — trade→earnings lead of 3-6 months (anticipated 2008).
**Value/Applicability:** High / immediate.

### 70. PMI new-orders minus inventories spread — destocking begins; margins compress before revenue; 4-8 week lead.
**Value/Applicability:** High / immediate.

### 71. Weekly jobless claims 4-week-MA RoC — 6-9 month recession lead; sharpened by the shrinking-labor-force context (claims rising into a shrinking denominator is worse).
**Value/Applicability:** Medium-high / immediate.

### 72. Prime-cohort credit-card delinquency RoC — stress climbing the quality ladder beats persistent subprime noise; 2-4 quarter lead.
**Value/Applicability:** High / immediate (Fed quarterly; issuer monthlies).

### 73. Industrial power consumption (EIA weekly, free) — hard-to-fake activity; divergence from GDP flags coming revisions (Li Keqiang-index logic).
**Value/Applicability:** Medium-high / immediate.

### 74. Google Trends distress queries ("refinance / debt consolidation / forbearance / layoff") — behavior precedes credit data by 1-2 reporting cycles; 4-8 week lead.
**Value/Applicability:** High (genuinely unique) / immediate and free.

### 75. CEO/CFO resignation RoC by sector (SEC 8-K, free) — executives exit with the most information; thin-explanation departure spikes preceded sector corrections; 1-3 quarter lead.
**Value/Applicability:** High / immediate with light scraping.

### 76. Discretionary-vs-staples foot traffic (Placer.ai/SafeGraph, weekly) — trading-down precedes earnings and credit deterioration; 4-6 week lead.
**Value/Applicability:** Medium-high / paid data.

### 77. NFIB hiring intentions — leads payrolls 2-3 months; intentions falling while payrolls positive = transition.
**Value/Applicability:** Medium / immediate, free.

### 78. Patent-filing RoC in AI categories (USPTO, quarterly) — R&D confidence with 18-36 month lag; a Layer-1 input more than a canary.
**Value/Applicability:** Medium / immediate but slow.

### 79. Alternative-lending/pawnshop transaction volumes (First Cash, EZCorp quarterlies) — bottom-of-ladder revealed distress leading mainstream indicators.
**Value/Applicability:** Medium / immediate via filings.

### 80. Employer-review sentiment RoC (Glassdoor/Blind) — morale → retention → productivity → earnings; employees see churn first (Enron precedent).
**Value/Applicability:** Medium (noisy) / free but unstructured.

### 81. AQR factor-health monitor (QMJ / BAB / TSMOM / VME, free monthly, 24 markets)
Rule: **3+ factors simultaneously in the bottom decile vs own history = crowded-trade unwind in progress** — one of the fastest propagation channels; QMJ compression (junk beating quality) = late-cycle; BAB crashes accompany margin-call cascades. **Currently amber.**
**Value/Applicability:** Very high / immediate and zero-cost — the best practical yield of the AQR review.

---

## Part XII — Research Foundations (who anchors what)

### 82. Brunnermeier-Pedersen liquidity spirals (2009) — the mechanism under Cat-0 cascades and Cat-6 stress. **Read first.**
### 83. Adrian-Brunnermeier CoVaR (2016) — conditional systemic risk; the divergence engine's academic cousin.
### 84. Adrian-Shin procyclical leverage (2013) — Category 0 at the institutional balance-sheet level.
### 85. Shin / BIS Annual Reports — the free institutional twin of this framework; source of the FCF/capex crossing flag.
### 86. Adrian / IMF GFSR (Apr & Oct) — growth-at-risk; regulator-grade twice-yearly cross-check.
### 87. Greenwood-Shleifer-You "Bubbles for Fama" + Greenwood-Hanson-Sørensen "Predictable Financial Crises" — velocity-of-ascent and credit-boom-plus-lax-standards evidence; validates cross-group divergence with 2-4 year leads.
### 88. Gabaix-Koijen inelastic markets + Gabaix granular origins — passive mechanics; top-100-firm shocks = ~1/3 of GDP volatility (Mag-7 risk at macro scale).
### 89. Shleifer-Vishny fire sales — why forced selling is most severe exactly when most damaging.
### 90. Stein "Overheating in Credit Markets" + monetary-policy-as-regulation — why A-red/B-green is danger, not comfort; why leverage migrates to NDFI channels.
### 91. Harvey yield-curve work — 3m10y called every recession since 1968; the Cat-5 calibration authority. His Duke/CFO survey is a bonus canary (CFO pessimism leads capex cuts 2-3 quarters).
### 92. Shiller — CAPE data and the finding that experts don't call bubbles in real time (why systematic canaries at all).
### 93. Cochrane — return predictability via discount rates; why high valuations mechanically imply low forward returns; free blog/materials.
### 94. O'Hara microstructure + Kyle lambda — the theory under VCI (price impact per unit of order flow; thin-volume moves are uninformative).
### 95. Fama-French / Ken French Data Library — 60+ years of global factor returns; threshold calibration spine.
### 96. Pedersen / AQR papers and datasets — the unified microstructure-factors-systemic-risk bridge; QMJ/BAB/TSMOM feeds #81.
### 97. Free repositories: NBER, SSRN, arXiv q-fin, BIS WPs, IMF WPs, NY Fed Liberty Street, FRED, CBOE (COR3M), SEMI, EIA.
**Collective value:** Every layer of the framework has named, free academic anchoring. **Applicability:** All free; a defined reading order exists (82 → 87 → 88 → 83 → 91 → 96).

---

## Part XIII — Case-Study Calibrations (the framework replayed)

### 98. 2007-08: thirteen months of ignored canaries
HY RoC fired Feb '07 at benign levels; TED >100bps Aug '07; equities made all-time highs Oct '07; Lehman Sep '08. Lesson: level-waiters lost the entire window. Current pattern-match: we are at the mid-2006 leverage configuration; the Aug-'07 analogue is Group B flipping.
### 99. 2022: the acceleration streak fired before the peak
CPI streak canary Jan '22 (S&P peaked Jan 4); 10Y acceleration Mar '22; all inflation canaries at the Jun 9.1% peak; acceleration canaries extinguishing into Oct '22 marked the tradeable turn. Current match: the exact velocity rows that led 2022 are our grey (unwired) rows — the top data gap.
### 100. Aug 2024: the counter-example
JPY velocity → VIX backwardation → -7% SPX in 3 days → full recovery in two weeks, because A/B/C never fired. Lesson: D-only shocks mean-revert; the slow layers decide whether a shock is a dip or a regime change.
**Value:** Very high — the empirical demonstration of the whole design. **Applicability:** Built into the platform as interactive timelines.

---

## Part XIV — Deliverables & Process Artifacts

### 101. Dashboard lineage
v1 four-group HTML snapshot → v2 nine-category threshold panel → v3 five-layer panel (45+ canaries, macro + bubble + structure layers, review calendar) → **v4 ten-page React platform** (Overview signal field, Divergence Engine with 31-month history, Canary Matrix with per-row drill-down sparklines, Bubble page with ascent trajectories, Macro, Structure tabs, Conviction Lens, Extended Correlations, Case Studies, Research Library) — syntax-verified, sample data throughout, honestly labeled.
**Value:** The framework made navigable. **Applicability:** v4 is the design spec; production = swapping synthetic generators for the named feeds.

### 102. Process principles that emerged
Grey means unknown, never green (unverified rows carry no assumed status). Fix the canonical doc separately from deferring the build (Track A vs Track B). Gate builds on real decision triggers, not calendars (SR-01: Phase 1 fires on the first genuine "is leverage building under a calm surface?" question). Record provenance of point-in-time web reads vs live feeds. Log rejections (#60) so they aren't re-litigated.
**Value:** High — the difference between a pile of ideas and a maintainable system. **Applicability:** Already practiced in-session.

### 103. The monitoring calendar
Daily: HY OAS, VIX/term structure, SDLLMTK, COR3M (once wired). Weekly: ICI flows, HY-plus-flows combination read, dark-pool monitor. Monthly: margin debt, M2, factor health, book-to-bill, SDLLMTK monthly view. Quarterly: SLOOS, BIG premium, guidance-language NLP, alt-manager seasonality (July). Dated: **Aug-Oct 2026 earnings (FCF/capex crossing — highest priority)**; **Sep 19 2026 quarterly OpEx** (elevated window given A-red/D-green).
**Value:** High — cadence turns indicators into practice. **Applicability:** Immediate.

---

## Part XV — Reverse Flow From the Market Divergence Engine Spec (added 7 July 2026)

The Phase-4 Market Divergence Engine design spec is Master Idea #3 productionized. Its design review surfaced five ideas that originated in the spec, not in the session, and belong in this inventory so the flow is captured in both directions.

### 104. Divergence half-life statistics
For every divergence type, compute duration statistics from resolved episodes: average, median, longest, shortest, N. Interpretation rule: divergences that persist well beyond their own median half-life have historically preceded larger corrections. This quantifies what the session only gestured at — the ~20-month A-D gap versus the ~19-month 2006-07 precedent becomes a measurable "this instance is at the Xth percentile of its own type's duration distribution."
**Value:** Very high — converts divergence *persistence* from anecdote into a scored variable, and gives every divergence a type-specific "overdue" flag. **Applicability:** Immediate once episodes are tracked; a single SQL aggregate over resolved observations; no new data required.

### 105. Resolution-cause taxonomy as a research dataset
Every resolved divergence is tagged with *why* it closed: `correction`, `credit_widening`, `vix_spike`, `policy_easing`, `leverage_normalisation`, `unknown`. Over time this answers "what usually resolves this divergence?" — turning the session's case-study narratives (2007 resolved via credit_widening→correction; Aug 2024 via vix_spike then mean-reversion) into a structured, queryable dataset rather than three hand-written stories.
**Value:** High — the distribution of resolution causes per type is itself a forecast (a type that resolves benignly 80% of the time deserves a different Kelly factor than one that resolves via correction 80% of the time). **Applicability:** Immediate as a schema field; the attribution logic is the only design work.

### 106. Formal rarity definition of a divergence
A divergence exists when conflicting signal states co-occur at below a governed rarity threshold — default <5th percentile of historical co-occurrence frequency. This is sharper than the session's qualitative "gaps between groups": it makes divergence detection a statistical statement with an explicit base rate, and it naturally suppresses "divergences" that are actually common configurations.
**Value:** High — adds statistical discipline and a tunable governance knob to the framework's central construct. **Applicability:** Immediate in design; requires historical co-occurrence tables per indicator pair, computable from the same free series already inventoried.

### 107. The Research Coach pattern (operator assessment as evidence)
Each morning the operator reads one divergence narrative and responds agree / disagree / unsure; the response is stored as an evidence unit alongside the computed observations. Human judgment accumulates as data in the same lifecycle as machine observations — a human-in-the-loop validation channel the session's framework lacked entirely.
**Value:** High — over time, operator-vs-engine disagreement rates become their own diagnostic (systematic operator disagreement on a type that keeps resolving benignly is a false-alarm detector; operator agreement on types that precede corrections is confirmation the narratives are informative). **Applicability:** Immediate as a workflow step; the value compounds only with months of accumulated responses.

### 108. Self-validation surfaces: false-alarm and Kelly-accuracy retrospectives (Divergence Laboratory)
A research-only surface that joins divergence history against outcomes: which types preceded corrections, which produced false alarms (resolved without correction/credit/vix causes), which Kelly reductions proved unnecessary against realized drawdowns, and — once ≥50 resolved episodes exist per type — full predictive statistics (average subsequent drawdown, median correction delay, false-alarm rate). This quietly fixes the session's most honest weakness: everything was calibrated on historical episodes, but no mechanism existed to measure the framework's own forward false-positive rate.
**Value:** Very high — it is the difference between an asserted framework and a tested one; without it, confidence never becomes earned. **Applicability:** Deferred by design (gated at ≥50 resolved episodes per type), but the data model supports it from day one, which is the right call — and backtesting the catalogue against 1999-2026 history can pre-seed the episode counts so validation doesn't take decades.

### Design-review findings that flowed the other way (session → spec)
Recorded here so the audit trail is complete: (a) the spec's indicator schema derives signal states from level thresholds only — no RoC/acceleration columns — contradicting Idea #1 and the spec's own 2007 calibration; flagged as a blocking pre-implementation fix. (b) The `UNIQUE(type, observation_date)` schema conflates daily observations with independent episodes, which would let one persistent divergence self-promote through every lifecycle gate on a sample of one; an `episode_id` with gates counted on episodes is required. (c) The Kelly factor derivation omits the bubble-percentile multiplier (Idea #63). (d) COR3M (#38), SDLLMTK (#48), and M2/SLOOS (#9-10) are absent from the v1 seed; the "TBD" liquidity index was already answered (FRED WALCL + TGA + reserves, free). (e) No OpEx temporal amplifier hook (#52). (f) `nasdaq_pe` inherits the circular-earnings problem (#30, #47); Disruptors composite or CAPE are more robust valuation proxies.
**Value:** High — five of six are cheap fixes precisely because the spec's DB-driven design makes indicators and types data, not code. **Applicability:** Items (a) and (b) are blocking before Phase 4.0 step 1; the rest slot into Phase 4.1.

---

## Part XVI — The July Exhibits Batch (#109–134, added 12 July 2026)

Sourced from the loser-decile table, the SpotGamma Nasdaq paper, three image sets, and the P/E-gap observation, plus nine derived constructions.

### Dispersion & volatility complex
**109. Loser-decile composition analysis.** Sector clustering of the worst YTD decile as disruption map, second-order credit-stress locator (equity losers → who lent against them; found the SaaS/$538B direct-lending collateral link), and dispersion-regime confirmation. *Value: high. Applicability: immediate, any free screener.*
**110. VXN−VIX spread.** +11.8, 90th percentile since 2001, widest outside crises in 25 years, with both indices near highs; 2000 the only precedent. *Value: high. Applicability: immediate, free.*
**111. NDX−SPX correlation spread (refined WP-04).** The bifurcation is the signal: SPX correlation at lows (genuine dispersion) while NDX correlation elevated (one macro AI trade). Corrects the earlier market-wide "correlations in the toilet" reading. *Value: very high. Applicability: immediate.*
**112. Vol-risk-premium inversion during strength.** NDX implied vol serially underpricing forward realized (gap >−10 pts) with positive returns — only prior instance: the internet bubble. Also the "hedges are objectively cheap" flag. *Value: very high. Applicability: good.*
**113. Index-methodology loosening (qualitative canary class).** Fast-entry seasoning cut to 15 days, float multipliers; SPCX in at 79% IV vs 51% constituent mean. Same family as disclosure degradation (#25, #47): the measurement infrastructure relaxes standards to chase the theme. *Value: high. Applicability: event-monitoring.*
**114. VIXEQ−VIX single-stock/index vol spread.** ~48 vs ~17, spread ~33 — highest in the 2015-26 series; index calm manufactured by offsetting moves. Latent convergence risk of ~30 vol points behind a 17 handle. *Value: very high. Applicability: immediate.*
**118. Convergence VIX (derived).** Compute the index vol implied by current single-stock IVs at crisis correlation (0.8-0.9) — a standing "what VIX becomes when the dispersion trade unwinds" number, plausibly 35-40 now. *Value: very high. Applicability: immediate, derivable.*
**133. Skew inversion / greed premium.** Call IV above put IV inverts a 39-year post-1987 structural feature; hedging has disappeared (Barron's/Cboe). Completes the vol quartet (110/114/COR3M/133) — four independent lenses, all at late-cycle extremes. *Value: very high. Applicability: immediate via risk-reversal data.*

### Rotation, structure & sequencing
**115. Old-Era vs New-Era rotation monitor (Paulsen).** Two cap-weighted baskets (tech+comms vs the other nine sectors) relative to the index; red-line chop vs blue-line grind is the one-trade-vs-diversified-core structure in sector form; current convergence = AI relative unwind in progress. *Value: high. Applicability: immediate.*
**117. AI sub-theme rollover ordering.** Robotics → memory → semis → power-infra as the contagion sequence; robotics cracked first (-17%), as the narrative-first ordering predicts. *Value: high. Applicability: immediate.*
**120. Rotation-vs-liquidation classifier (derived).** 2×2 on Old-Era absolute trend × New-Era relative trend: rotation (benign) vs liquidation (systemic, the 2008 signature). The cheapest answer to "contained or systemic?" *Value: high. Applicability: immediate.*
**122. Downside-correlation asymmetry (derived).** Intra-AI-complex correlation on down-days vs up-days; downside exceeding and rising = exit doors narrowing early. *Value: high. Applicability: good.*
**123. Relative-performance instability pair (derived).** Realized vol of the QQQ/SPY ratio + leadership-flip frequency; both accelerating marked 2000 and 2007 topping churn. *Value: medium-high. Applicability: immediate.*
**126. Theme-peak lag compression (derived).** Measure the lag between successive sub-theme peaks; compressing lags = accelerating unwind (2000: months → weeks). Turns #117's ordering into a speedometer. *Value: medium-high. Applicability: good.*
**134. Peripheral-market-first sequencing.** KOSDAQ (retail-leverage epicenter of the AI trade) -35% in weeks while the US core holds — the outside-in crack pattern of Asia '97/Japan '90. Adds geography to the contagion clock. *Value: high. Applicability: immediate.*

### Rates, regime & flows
**116. Secular-cycle recalibration (Layer 1).** If 2020 was the generational yield low (1830/1886/1945/2020 sequence), Cat-5 thresholds calibrated on the 1981-2020 bull need a regime where >5% is normal. Three observations = assertion, not statistics — logged with that caveat. *Value: medium-high as context. Applicability: interpretive.*
**121. Steepener composition classifier (derived).** Classify curve moves by which end leads: bull steepener (Fed cutting into weakness) vs bear steepener (term premium/fiscal, no Fed put — historically the worst post-inversion configuration; the current one) vs twist. *Value: high. Applicability: immediate, FRED.*
**124. Retail duration-flow contrarian signal (derived).** Heavy retail buying of long-duration ETFs against a rising secular yield regime = wrong-way positioning; the fixed-income twin of meme reactivation. Closes the loop on the session's opening TLT/BLV exhibit. *Value: medium-high. Applicability: immediate.*
**125. Cash-competition signal (derived).** Bill-yield RoC rising alongside MMF-asset-growth RoC = the marginal buyer paid to defect from the passive flow loop; direct input to absorption capacity. *Value: medium-high. Applicability: immediate.*
**129. Stock-bond correlation regime.** 3-yr rolling correlation hit 0.72 (Jan '25) — highest since 1929, above Dec '42 and Jun '96 — retreating to 0.53. Positive regime breaks the 60/40 hedge assumption embedded in every allocator model; watch whether the retreat is durable (Schwab notes deep re-negativisation episodes intra-year — track the oscillation, not one print). *Value: very high. Applicability: immediate.*

### Expectations, valuation & positioning
**127. Trailing-vs-forward P/E gap, regime-conditioned.** The gap = implied consensus EPS growth; historically wide only at extremes. Euphoria variant (wide gap on record trailing earnings — now, 2000) vs trough variant (2009/2020/late-2022, a buy signal). Only the conditioned version is a canary. *Value: high. Applicability: immediate, free.*
**128. Revision-breadth trigger + guidance-tone divergence.** Resolution begins when forward-revision breadth turns negative at record gap wides; pre-condition is guidance-NLP red while estimates rise. *Currently inverted — see #143.* *Value: high. Applicability: immediate, FactSet weekly.*
**130. Household equity allocation share.** Record ~33%+ of net worth (above 2000); one of the strongest long-horizon return predictors — a supply-of-future-buying measure. Paired with #36: record exposure meeting structural decumulation. *Value: very high. Applicability: immediate, Fed Z.1.*
**132. Sideline-cash ratio.** MMF+deposits / SPX cap at 0.42, boxed with the 2000 low. Mechanical caveat written in: the ratio falls automatically as market cap rises — but that is exactly the absorption-capacity point. *Value: medium-high, caveated. Applicability: immediate.*

### Income & real assets
**119. Fast-entry inclusion absorption test.** Each fast-entry mega-inclusion is a natural experiment on #37: price behavior net of mandatory passive buying over the following fortnight. SPCX (July 7) is trial one. *Value: very high. Applicability: running now. See #142 for the first result.*
**131. Commodity roll-yield regime (dual-use).** Five years of near-continuous oil backwardation: spot +0.6%, roll-yield investor +222%. The first income idea of the session to pass the risk-framing test — structural scarcity carry, not tail-risk selling — and simultaneously an inflation-regime canary and the natural asset for a positive stock-bond-correlation world. Caveats logged: window flatters, contango kills it, 26%/yr is not steady-state. *Value: high. Applicability: immediate.*

---

## Part XVII — Scour Results: Escalations and Contradictory Evidence (#135–145, added 12 July 2026)

A deliberate hunt for adjacent-confirming and *contradictory* signals. The private credit findings escalate Group B materially; the demand-side findings genuinely cut against the exhaustion thesis and are recorded with full weight.

### Confirming / escalating — the private credit cluster
**135. True vs headline private-credit default rate.** Headline (Morningstar/LSTA formal defaults) ~1-2%; Fitch's broad measure including deferrals/selective defaults: **5.8%** for the 12 months to Jan '26, highest since tracking began; Proskauer index 2.73% Q1 '26 from 1.84% two quarters prior; Morgan Stanley warns of 8%. The measurement gap is itself a #25-class opacity canary. *Value: very high — Group B's private half is already amber/red while HY prints 270bps. Applicability: immediate (Fitch/Proskauer publish).*
**136. PIK concealment metrics.** 60% of defaults are PIK conversions/deferrals; ~40% of private-credit borrowers now negative-FCF (25% in 2021); borrower leverage 5.1× EBITDA. Distress compounding invisibly at the bottom of the waterfall — "bad PIKs." Track PIK share of BDC income (public filings). *Value: very high. Applicability: immediate for BDCs.*
**137. Gating and redemption events — the liquidity-mismatch canary has already fired.** Blackstone BCRED: $3.7B requests (~8% of NAV) vs 5% cap; Carlyle CTAC: 15.7% vs cap; Blue Owl gated Feb '26 catching CalPERS. Exit doors already proven narrower than entrances. *Value: very high — this is observed stress, not forecast. Applicability: event log, ongoing.*
**138. Bank NDFI exposure — new data source unlocked.** Q1 2026 brought first granular GSIB disclosure: ~$1.14T drawn (from $250B in 2010), ~$3T exposure-at-default with commitments, NDFI loans ~11% of bank books; JPM $330B/$50B private credit; Deutsche's disclosure alone hit its share price; the Fed is formally querying banks while regulators withhold full line-item data. The "TBD" rows in Cat 6 now have a quarterly feed. *Value: very high. Applicability: immediate each earnings season.*
**139. Insurer transmission channel.** Private credit >10% of US life-insurer assets (>15% for PE-affiliated Athene/Global Atlantic); insurance the worst-performing IG segment early '26; Treasury has stood up a dedicated team. Insurer equity/spread underperformance = an advance market estimate of private marks, parallel to the alt-manager signal (#58). *Value: high. Applicability: immediate.*
**140. Retailization of private credit.** Fidelity/Vanguard partnerships placing private credit inside 401(k) managed accounts with DOL support — illiquid, stale-marked assets distributed to retail at the cycle's late stage. Same family as #113 and #57: distribution-to-retail at the top. *Value: high. Applicability: policy/event monitoring.*
**145. Official-reassurance vs official-action divergence (qualitative).** CEOs and Treasury universally downplaying ("adolescent moment," "no significant threat") while the Fed formally queries banks, Treasury builds an insurer team, the FSB publishes a four-cluster vulnerability report, and Dimon simultaneously says "cockroaches" and "not systemic." When reassurance cadence and supervisory action diverge, weight the actions. *Value: high. Applicability: qualitative log.*

### Contradictory — recorded with full weight
**141. Corporate buyback breadth — the missing demand pillar.** >$1T annualized and *broadening*: daily active repurchase programs from ~10 to 50-60, mid-caps and industrials joining, funded by corporate profits of $4.4T (+12.8% YoY; manufacturing +31%). The one buyer that never panics directly cuts against demand-side exhaustion (#130/#132). Corollary canary: buyback blackout windows around earnings become the market's most bid-less periods — a temporal vulnerability overlay like #52. *Value: very high as counter-evidence. Applicability: immediate (S&P/Birinyi data; blackout calendar known).*
**142. Absorption test — first result: PASSED.** June 2026's two capital raises totaling $140B (largest back-to-back equity supply in US history) were absorbed without disruption, with broad buybacks acting as the structural bid. Direct evidence against the fire-hose-becomes-vacuum thesis (#37/#119) *at current flow rates*. Logged as a genuine negative result; the test repeats with every fast-entry inclusion. *Value: high — negative results are evidence. Applicability: done; repeat per event.*
**143. Upward-revision regime — the benign gap-closing path is active.** Consensus 2026 S&P EPS growth revised from <16% to ~25% during the year (LSEG/Schwab); Q1 profits delivered above every cautious forecast. The #128 trigger is not merely un-fired — it is inverted: estimates are chasing delivery upward, the 1996-98 outcome so far. The bear case requires this to break; the honest ledger says it hasn't. *Value: very high as counter-evidence. Applicability: immediate, weekly.*
**144. Insider-selling vs corporate-buyback divergence.** Insiders selling at records while their companies repurchase at records; insider buy-ratios historically out-predict most valuation metrics at 12 months, and corporates historically buy high. When the informed personal account and the corporate account disagree, weight the personal one. *Value: medium-high. Applicability: immediate (Form 4 aggregators).*

### Reassessment paragraph (the honest ledger as of 12 July 2026)
Group B must now be read as **split internals**: public HY green at ~270bps while the private half shows 5.8% broad defaults, gatings, PIK concealment, and insurer underperformance — the framework's predicted sequence (public equity losers → alt-manager equity → private marks/gatings → HY spreads) is observably at step three of four. Against that, three contradictory pillars are genuinely strong and currently winning: earnings are being delivered and revised *up* (#143), the corporate bid is record-sized and broadening (#141), and the market just absorbed record equity supply without strain (#142). The framework's falsifiable statement of the moment: the bear resolution requires #143 to invert (revision breadth turning negative) and/or #141 to pause (blackout windows or profit rollover) *while* the private-credit stress (#135-137) reaches the public HY market; until then, the divergences persist rather than resolve. Q3 2026 earnings season adjudicates most of this in one window.

---

## Part XVIII — The Execution Layer (#146–148, added 12 July 2026)

From the 1929 Dow monthly-signal chart and the Ivy 10/12-month SMA table. The honest correction that defines the role: monthly trend signals did not *predict* 1929 — the sell fired at the October close of 273.51, already ~28% below the 381 peak. What they did was **truncate the tail** (avoiding the further −85% grind to 41) and **re-enter with discipline** (Aug 1932 at 73.16, months off the absolute bottom). They are tail-truncation and re-entry instruments, not early warnings — which makes them the framework's execution layer, not its warning layer. Division of labor: **canaries say "prepare" (2007: TED fired four months before the trend broke), the monthly cross says "act."** Monthly-close discipline also correctly ignores Aug-2024-style intramonth D-only shocks — matching the case-study taxonomy by construction. The combined design, validated on the worst tape in history: canaries compress exposure as they accumulate (Kelly-style, #63); the trend break executes the remainder mechanically.

### 146. Trend-variance as distance-to-cascade
The % that each asset sits above its 10/12-month MA = the decline required to flip every monthly trend model to Cash simultaneously. Currently ~7-9% across the equity models — put beside the SpotGamma ~10% correction forecast and NDX short gamma: a garden-variety correction now mechanically converts the trend-following complex into forced sellers at the moment dealer hedging amplifies. **Value:** high — converts a status table into a fragility number. **Applicability:** immediate, free, monthly.

### 147. Fast-vs-slow trend split as regime-transition tell
When the 10-month and 12-month signals disagree on an asset class, the faster is usually announcing the regime change the slower confirms later. Live instance: IEF at Cash on the 10-month (−0.1%) while Invested on the 12-month (+0.3%) — bonds sitting exactly on trend, the first asset class off this cycle; #116/#121/#129 expressed in one table row. **Value:** medium-high. **Applicability:** immediate.

### 148. All-assets-above-trend breadth
Count of Ivy asset classes above trend as a melt-up marker: 4/5 on the 10-month (5/5 on the 12-month) with bonds marginal and international more extended than the US — everything-up-except-bonds is one macro trade expressed across asset classes, historically clustering late in cycles. **Value:** medium. **Applicability:** immediate.

---

## Closing synthesis

The session's five most valuable single ideas, if forced to rank: **(3) cross-group divergence as the primary signal**, **(63) bubble-percentile weighting of canary responses**, **(42-46) the AI circular-revenue complex with its dated Q3-2026 catalyst**, **(38/111/114/118/133) the volatility-dispersion complex**, and **(53) the VCI metric**. The most valuable *practical* finding is humbler: nearly everything above runs on free data — FRED, FINRA, ICI, CBOE, SEMI, EIA, AQR, Ken French, and now the Q1-2026 bank NDFI disclosures — and the framework's remaining gap is wiring, not ideas.

Part XV records that the flow runs both ways: the Market Divergence Engine spec implements Idea #3 and returns five ideas of its own (#104-108), the last of which — the self-validation laboratory — addresses the framework's one unresolved honest weakness: measuring its own forward false-positive rate. Parts XVI-XVII then stress-tested the framework against fresh evidence in both directions; the document now carries its contradictory evidence (#141-144) with the same weight as its confirmations, which is the only way a warning framework earns the right to be believed when it finally shouts.

*Analytical framework compiled from a working research session. Point-in-time readings date from late June/early July 2026 web pulls and are labeled as such. Not investment advice.*
