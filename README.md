# ExtraLogic.com

Daily logic puzzles, brain games, a free Reasoning Test, a Logic Academy, contests with prizes, and B2B lead generation. It's a static site, hosted free on GitHub Pages.

- **Live:** https://extralogic.com (custom domain via `CNAME`)
- **Master build prompt:** [`PROMPT.md`](PROMPT.md)

## Structure
```
index.html, *.html, learn/*.html   ← generated pages (served by GitHub Pages)
css/style.css                      ← design system (light + dark)
js/config.js                       ← ONE file to configure AdSense, donations, YouTube, form alias
js/main.js                         ← forms, ads, consent, theme, streaks, donations
js/games.js  js/data.js            ← 6 games + puzzle banks (add items to expand)
js/iqtest.js                       ← Reasoning Test + email-gated report
build/pages/*.html                 ← page sources (edit these)
build/build.py                     ← injects header/footer/SEO, writes sitemap.xml
build/make_games.py                ← generates the game page sources
```

## Edit & rebuild
```bash
python3 build/make_games.py   # only if you changed game pages
python3 build/build.py
git add -A && git commit -m "Update" && git push
```

## Go-live checklist
1. **Pages:** Settings → Pages → Deploy from branch → `main` / root. Enforce HTTPS.
2. **DNS:** A records 185.199.108–111.153; `www` CNAME → `webworksa1.github.io`.
3. **Forms:** submit any form once on the live site, then click the FormSubmit activation email. Optionally paste the alias it gives you into `formsubmitAlias` in `js/config.js`.
4. **AdSense:** set `adsenseClient` (+ slot IDs) in `js/config.js` and update `ads.txt`.
5. **Donations:** paste PayPal / Stripe / BMC / Patreon / GitHub Sponsors links into `donate` in `js/config.js`.
6. **Analytics/YouTube:** set `gaMeasurementId`, `youtubeChannelUrl`.

The contact address is stored only in encoded form in `js/config.js` and never appears on the site.
