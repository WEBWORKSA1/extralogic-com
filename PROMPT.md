# ExtraLogic.com — Phase-Wise Master Build Prompt

> Reusable prompt for building, rebuilding or extending ExtraLogic.com with any AI coding agent. Run the phases in order. Each phase ends with acceptance criteria that must pass before you move on.
> The owner contact email is referred to as `{{OWNER_EMAIL}}`. It must **never** appear as plain text on the site, in HTML or in the repository. Store it only encoded (reversed + base64) in `js/config.js`.

---

## PHASE 0 — Concept lock (context for every phase)

**Role:** You are a senior product engineer, UX designer and growth marketer building a world-class, monetized content and games website.

**Domain:** ExtraLogic.com ("Extra Logic").
**Positioning:** "The daily gym for your logical mind": free daily logic puzzles, brain games, a free IQ-style Reasoning Test, a Logic Academy, video explainers and monthly logic contests with prizes. B2B revenue comes from team-building events, reasoning assessments for hiring, and school licenses.

**Why this concept (data):**
- NYT Games logged **11.2 billion plays in 2025**. Daily-puzzle habits drive huge repeat traffic (Fast Company). NYT bought Wordle for a low-seven-figure sum.
- "iq test" gets about **309K searches/month**, plus "free iq test" about 76K and "iq test free" about 65K (Ahrefs estimates via ahrefstop). The Reasoning Test is the SEO and lead-capture engine.
- AdSense RPM runs **$15–30 for education** versus $4–10 for gaming (adstimate). Frame content as learning ("Logic Academy", "reasoning skills") to earn education-tier RPMs.
- Comparable sites earn from ads plus a premium tier at $3–4/mo (Sporcle, Puzzle Baron), paid reports (123test, $12.99), patron donations (lichess) and sponsored contests (LeetCode, Kaggle).

**Hard requirements (apply to every page):**
1. A top banner on every page: "Contact, if you are interested in this website/domain name", linked to `https://web.works/contact`.
2. All forms and contact links deliver to `{{OWNER_EMAIL}}` only, and the address is never exposed. Decode it at runtime in JS; show "Email us" link text, never the address.
3. Static site hostable free on GitHub Pages (public repo `webworksa1/extralogic-com`, branch `main`, root folder). No server code, no build step required at deploy time.
4. Modern, interactive, responsive (360px–1440px+), dark/light mode, accessible (WCAG AA, keyboard-playable games).

---

## PHASE 1 — Competitive research (25+ sites)

Visit and extract features from: brilliant.org, logic.puzzlebaron.com, brainzilla.com, conceptispuzzles.com, lumosity.com, elevateapp.com, braingle.com, sudoku.com, chess.com/puzzles, lichess.org/training, mathigon.org, 123test.com, iqtest.com, mensa.org workout, brainbashers.com, sporcle.com, puzzle-nonograms.com, logiclike.com, cognifit.com (B2B + test), hackerrank.com/products/screen, peak.net, leetcode.com/contest, mathsisfun.com/puzzles, jigsawplanet.com, kaggle.com/competitions, khanacademy.org (LSAT logic).

**Output:** a feature matrix covering navigation/UX, puzzle mechanics, SEO content, engagement, monetization, lead-gen forms, community/contests and trust signals.

**Must-copy patterns:** daily puzzle with a midnight reset; streaks; difficulty tiers; timer, hints and step-by-step workings; spoiler-free share cards (Wordle-style); Hall of Fame; audience split (learner / parent-teacher / business); free score now with the detailed report gated by email; 3-field B2B forms with a "Book a demo" CTA; ad removal as the main premium perk; monthly timed contests; user puzzle submissions; clear "not an official IQ test" disclaimer.

---

## PHASE 2 — Information architecture & design system

**Pages:** Home · Puzzles hub · 6 game pages (Sudoku, Code Breaker, Lights Out, Tower of Hanoi, Number Sequences, Knights & Knaves) · Reasoning Test · Logic Academy + 4 articles · Videos · Contests · Leaderboard · Submit a Puzzle · For Business (dedicated lead gen) · Advertise & Sponsor · Support/Donate · Pro (waitlist) · Careers & Talent · About & FAQ · Contact · Acquisition · Privacy · Terms · 404.

**Design system:** Space Grotesk (display) + Inter (body). Warm off-white background and an ink-navy dark theme. Brand amber `#ff9f1c`, accent teal `#11a88f`, indigo links. 14px card radius, soft shadows, sticky blurred header, highlighter-underline hero words. All colors are CSS variables with a `[data-theme="dark"]` override.

**Architecture:** static HTML generated from fragments (`build/pages/*.html`) by `build/build.py`, which injects head/SEO, header with the domain banner, footer, newsletter band, consent banner and ad slots. Shared JS: `config.js` (single edit point), `main.js` (forms, ads, consent, theme, streaks, donations), `games.js`, `data.js` (puzzle banks), `iqtest.js`.

**Acceptance:** every page shares one header and footer; adding a page means adding one fragment and re-running the build.

---

## PHASE 3 — Core games & daily engine

Build in vanilla JS (no frameworks):
- **Sudoku:** seeded daily generator (same grid worldwide), uniqueness check, 4 difficulties, keyboard and numpad input, peer highlighting, error check, hints, timer, share.
- **Code Breaker (Mastermind):** 4 pegs × 6 colors, 10 guesses, black/white feedback, emoji share grid.
- **Lights Out:** 5×5, solvable seeded boards, progressive levels.
- **Tower of Hanoi:** 3–8 disks, move counter against the 2ⁿ−1 minimum.
- **Quiz engine:** Number Sequences and Knights & Knaves, 8 questions/day with explanations.
- **Riddle of the Day** widget on the homepage (fuzzy answer matching).
- **Shared:** streaks, best streak, points and solve history in localStorage; `XL.markSolved()`; Web Share API with clipboard fallback.

**Acceptance:** every game is solvable end-to-end, mobile-friendly and free of console errors.

---

## PHASE 4 — Reasoning Test (SEO + lead-gen engine)

20 questions (5 each: numerical, verbal, pattern, deductive), 15-minute timer, instant score on a 70–150 scale with an ability band, shareable result. Gate the full report (per-skill bars, answer review, practice plan) behind first name + email + purpose ("screening candidates for my company" marks a B2B lead). Include a hidden result field, a pre-checked newsletter opt-in and a soft skip link. Add a "Hiring? Use this test with your candidates" CTA → Business demo. Disclaimer: practice assessment, not a clinical IQ test.

---

## PHASE 5 — Lead generation (highest priority revenue)

- **For Business page:** hero, 4 solution tiers with indicative pricing (Team Events from $15/person, Assessments from $4/candidate, School License from $99/class/yr, Sponsored Contests custom), a 3-step process, and a long-form demo form (name, work email, org, role, phone, country, solution, group size, timeline, budget, goals, consent). Tier buttons pre-select the solution.
- **Homepage lead block** (short form) and a mobile sticky CTA, "Get a Team Demo".
- **Micro-conversions:** newsletter band on every page, teacher lesson-pack form, Pro waitlist, contest registration, game-vote form.
- **Form transport:** AJAX POST to FormSubmit (`https://formsubmit.co/ajax/<address or alias>`), with the address decoded at runtime, honeypot, `_subject`, `_template=table`, `_replyto`, page URL and timestamp. On failure, fall back to a prefilled mailto that opens from a hidden link. Fire a GA4 `generate_lead` event on success.

---

## PHASE 6 — Monetization

- **AdSense:** loaded only when `adsenseClient` is set in config; responsive `<ins>` units in leaderboard, in-content and sidebar slots. Consent banner with a non-personalised-ads fallback. `ads.txt` template. Until approval, slots show house ads that sell direct placements (→ Advertise).
- **YouTube:** lite embeds (thumbnail first, iframe on click) for speed; subscribe CTAs driven by config.
- **Affiliates:** puzzle books with `rel="sponsored"` and a disclosure.
- **Premium:** ExtraLogic Pro waitlist ($29/yr founding price, $49/yr family).
- **Sponsorship rate card:** sponsored daily puzzle, contest title sponsor, YouTube integration, newsletter slot, direct display, education partners.

---

## PHASE 7 — Donations, contests, prizes, hiring, promotion

- **Support page:** one-time/monthly toggle, preset and custom amounts, PayPal / Stripe / Buy Me a Coffee / Patreon / GitHub Sponsors buttons (config links; empty links fall back to a pledge form), fund-goal progress bar, allocation table, 3 supporter tiers, and a pledge/in-kind/volunteer form.
- **Contests:** monthly championship, live countdown to the first Saturday of each month (UTC), Open/Student/Team divisions, prize table, registration form with rules acceptance, sponsor CTA.
- **Leaderboard:** personal stats and history, plus a Hall of Fame.
- **Careers:** 6 roles (puzzle designer, writer, video editor, game dev, partnerships, moderator) with an application form; role buttons pre-select the role.
- **Submit a Puzzle:** a form with rights confirmation.

---

## PHASE 8 — SEO, performance, compliance

Unique title/description per page, canonical URLs, OpenGraph/Twitter tags, JSON-LD (Organization, WebSite, VideoGame, FAQPage), `sitemap.xml` generated by the build, `robots.txt`, a web manifest, SVG favicon and OG image, and a 404 page. Aim for Lighthouse 90+. Privacy policy with the Google advertising-cookie disclosure and opt-out links; Terms with contest rules (no purchase necessary, eligibility, anti-AI rule, payout terms).

---

## PHASE 9 — QA

Run a headless browser across every page: no JS errors, no horizontal overflow at 390px, domain banner present and linked, **zero occurrences of the email address in any file**, and all games solvable. Test forms against their success path and the offline fallback.

---

## PHASE 10 — Deploy (GitHub Pages, free plan)

1. Push to `github.com/webworksa1/extralogic-com` on branch `main`, including `.nojekyll` and `CNAME` (`extralogic.com`).
2. Repo → Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`. Enforce HTTPS.
3. DNS at the registrar: apex A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (+ AAAA `2606:50c0:8000::153` … `8003::153`), and `www` CNAME → `webworksa1.github.io`.
4. After deploy, submit one test form → click FormSubmit's activation email → paste the returned alias into `formsubmitAlias` in `js/config.js`.
5. Apply for AdSense → paste `ca-pub-…` into config and the line into `ads.txt`. Add GA4 ID, donation links and the YouTube channel URL.

---

## PHASE 11 — Growth roadmap (post-launch)

- **Months 1–3:** 1 SEO article/week ("iq test for kids", "logic puzzles with answers", "aptitude test practice"); 3 YouTube Shorts/week from daily puzzles; submit the sitemap to Search Console.
- **Months 3–6:** add nonograms, logic grids and KenKen; a printable PDF archive (Pro); a Discord community; the first sponsored contest.
- **Months 6–12:** Pro accounts with sync (Supabase/Firebase free tier), a B2B assessment dashboard, embeddable puzzle widgets for backlinks, and multi-language versions.
