#!/usr/bin/env python3
"""ExtraLogic.com static builder.
Each file in build/pages/ starts with a JSON meta line:  <!--{"title":..., "desc":..., "out":"index.html", "scripts":["games.js"], "nav":"puzzles"}-->
Run:  python3 build/make_games.py && python3 build/build.py   -> writes final HTML into the repo root (GitHub Pages serves it as-is).
To add a page: drop a new fragment in build/pages/ and re-run. Header, footer, ads, banner and SEO are injected automatically.
"""
import json, os, re, glob, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://extralogic.com"
VER = datetime.date.today().strftime("%Y%m%d")

NAV = [("puzzles", "puzzles.html", "Puzzles"), ("test", "reasoning-test.html", "Reasoning Test"), ("learn", "learn.html", "Learn"),
       ("videos", "videos.html", "Videos"), ("contests", "contests.html", "Contests"), ("business", "business.html", "For Business"),
       ("support", "support.html", "Support")]

def head(m, r):
    canon = SITE + "/" + ("" if m["out"] == "index.html" else m["out"])
    ld = m.get("jsonld", "")
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{m['title']}</title>
<meta name="description" content="{m['desc']}">
<link rel="canonical" href="{canon}">
<meta name="robots" content="{m.get('robots','index,follow,max-image-preview:large')}">
<meta name="theme-color" content="#12131c">
<meta property="og:type" content="{m.get('ogtype','website')}">
<meta property="og:site_name" content="ExtraLogic">
<meta property="og:title" content="{m['title']}">
<meta property="og:description" content="{m['desc']}">
<meta property="og:url" content="{canon}">
<meta property="og:image" content="{SITE}/img/og.svg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{r}img/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="{r}manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{r}css/style.css?v={VER}">
<script>try{{var t=localStorage.getItem('xl_theme');if(t)document.documentElement.setAttribute('data-theme',JSON.parse(t));}}catch(e){{}}</script>
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"Organization","name":"ExtraLogic","url":"{SITE}","logo":"{SITE}/img/favicon.svg","sameAs":["https://www.youtube.com/@ExtraLogic"]}}</script>
{ld}
</head>"""

def header(m, r):
    cur = ' aria-current="page"'
    links = "".join('<li><a href="' + r + href + '"' + (cur if m.get("nav") == k else "") + '>' + label + '</a></li>' for k, href, label in NAV)
    return f"""<body data-root="{r}">
<a class="skip" href="#main">Skip to content</a>
<div class="domain-bar"><a data-domain-link href="https://web.works/contact" target="_blank" rel="noopener">Contact, if you are interested in this website/domain name</a></div>
<header class="site-header">
  <nav class="container nav" aria-label="Main">
    <a class="logo" href="{r}index.html" aria-label="ExtraLogic home"><span class="logo-mark">∴</span><span>Extra<b>Logic</b></span></a>
    <ul class="nav-links" id="nav-links">{links}</ul>
    <div class="nav-actions">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
      <a class="btn btn-primary btn-sm" href="{r}reasoning-test.html">Take the Free Test</a>
      <button class="icon-btn menu-btn" aria-label="Open menu" aria-controls="nav-links" aria-expanded="false">☰</button>
    </div>
  </nav>
</header>
<main id="main">"""

def footer(m, r):
    scripts = "".join(f'<script src="{r}js/{s}?v={VER}" defer></script>' for s in m.get("scripts", []))
    return f"""</main>
<div class="ad-slot" data-ad="leaderboard"></div>
<section class="container" style="padding-top:20px">
  <div class="cta-band">
    <div><span class="eyebrow" style="color:var(--brand)">The Daily Logic Drop</span><h2 style="margin:0 0 6px">One puzzle. Every morning. Free.</h2>
    <p class="mb0">Daily puzzles, contest alerts, prize announcements and 2-minute logic lessons. No spam. Unsubscribe any time.</p></div>
    <form data-form="Newsletter signup" data-success="You're in! Check your inbox for tomorrow's puzzle." class="inline-form" aria-label="Newsletter">
      <input type="email" name="email" placeholder="you@example.com" required aria-label="Email address">
      <input type="hidden" name="list" value="Daily Logic Drop">
      <button class="btn btn-primary" type="submit">Subscribe</button>
    </form>
  </div>
</section>
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="logo" href="{r}index.html"><span class="logo-mark">∴</span><span>Extra<b>Logic</b></span></a>
        <p class="muted small mt">Daily logic puzzles, brain games, reasoning tests and courses that train sharper thinking. Free to play, funded by ads, sponsors and people like you.</p>
        <div class="social"><a data-social="youtube" href="#" aria-label="YouTube">YT</a><a data-social="x" href="#" aria-label="X">X</a><a data-social="instagram" href="#" aria-label="Instagram">IG</a><a data-social="linkedin" href="#" aria-label="LinkedIn">in</a><a data-social="discord" href="#" aria-label="Discord">DC</a></div>
      </div>
      <div><h4>Play</h4><ul>
        <li><a href="{r}sudoku.html">Daily Sudoku</a></li><li><a href="{r}code-breaker.html">Code Breaker</a></li><li><a href="{r}lights-out.html">Lights Out</a></li>
        <li><a href="{r}tower-of-hanoi.html">Tower of Hanoi</a></li><li><a href="{r}number-sequences.html">Number Sequences</a></li><li><a href="{r}knights-and-knaves.html">Logic Challenges</a></li></ul></div>
      <div><h4>Learn</h4><ul>
        <li><a href="{r}learn.html">Logic Academy</a></li><li><a href="{r}learn/logical-fallacies.html">Logical Fallacies</a></li><li><a href="{r}learn/deductive-vs-inductive-reasoning.html">Deduction vs Induction</a></li>
        <li><a href="{r}learn/how-to-solve-logic-grid-puzzles.html">Logic Grid Guide</a></li><li><a href="{r}learn/critical-thinking-exercises.html">Critical Thinking</a></li><li><a href="{r}videos.html">Videos</a></li></ul></div>
      <div><h4>Community</h4><ul>
        <li><a href="{r}contests.html">Contests &amp; Prizes</a></li><li><a href="{r}leaderboard.html">Leaderboard</a></li><li><a href="{r}submit-puzzle.html">Submit a Puzzle</a></li>
        <li><a href="{r}support.html">Donate / Support</a></li><li><a href="{r}premium.html">ExtraLogic Pro</a></li><li><a href="{r}careers.html">Careers &amp; Talent</a></li></ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="{r}business.html">For Teams &amp; Schools</a></li><li><a href="{r}advertise.html">Advertise &amp; Sponsor</a></li><li><a href="{r}about.html">About &amp; FAQ</a></li>
        <li><a href="{r}contact.html">Contact</a></li><li><a href="{r}acquisition.html">Acquire this site</a></li><li><a href="{r}privacy.html">Privacy</a> · <a href="{r}terms.html">Terms</a></li></ul></div>
    </div>
    <div class="footer-bottom"><span>© <span data-year>2026</span> ExtraLogic.com · Think beyond the obvious.</span><span><a href="{r}privacy.html#cookies">Cookie settings</a> · <a href="{r}sitemap.xml">Sitemap</a> · <a href="#" data-mail="ExtraLogic website inquiry">Email us</a></span></div>
  </div>
</footer>
<div class="consent" role="dialog" aria-label="Cookie consent"><b>Cookies &amp; ads</b><p class="small mb0">We use cookies for analytics and to show ads (including Google AdSense) that keep ExtraLogic free. <a href="{r}privacy.html#cookies">Learn more</a>.</p>
<div class="btns"><button class="btn btn-primary btn-sm" data-accept>Accept all</button><button class="btn btn-ghost btn-sm" data-decline>Essential only</button></div></div>
<a class="btn btn-primary sticky-cta" href="{r}business.html#demo">Get a Team Demo</a>
<script src="{r}js/config.js?v={VER}"></script>
<script src="{r}js/main.js?v={VER}" defer></script>
{scripts}
</body>
</html>
"""

def build():
    pages = []
    for f in sorted(glob.glob(os.path.join(ROOT, "build", "pages", "*.html"))):
        src = open(f, encoding="utf-8").read()
        mm = re.match(r"<!--(\{.*?\})-->\n", src, re.S)
        m = json.loads(mm.group(1)); body = src[mm.end():]
        depth = m["out"].count("/"); r = m.get("root", "../" * depth)
        body = body.replace("{{R}}", r)
        html = head(m, r) + "\n" + header(m, r) + "\n" + body + "\n" + footer(m, r)
        out = os.path.join(ROOT, m["out"]); os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(html)
        if m.get("robots", "").startswith("noindex") is False and m["out"] != "404.html":
            pages.append((m["out"], m.get("priority", "0.7")))
    today = datetime.date.today().isoformat()
    pages.sort(key=lambda p: -float(p[1]))
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p, pr in pages:
        loc = SITE + "/" + ("" if p == "index.html" else p)
        sm.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod><priority>{pr}</priority></url>")
    sm.append("</urlset>")
    open(os.path.join(ROOT, "sitemap.xml"), "w").write("\n".join(sm) + "\n")
    print(f"Built {len(pages)} indexed pages")

if __name__ == "__main__":
    build()
