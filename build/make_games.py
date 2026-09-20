#!/usr/bin/env python3
"""Generates game page fragments into build/pages/. Run before build.py when editing games."""
import json, os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pages")

SIDEBAR = """<aside>
  <div class="card"><h3>Your stats</h3><p class="mb0">🔥 Streak: <b data-streak>0</b> days<br>🏆 Best streak: <b data-best>0</b><br>⭐ Points: <b data-points>0</b></p>
  <a class="btn btn-ghost btn-sm mt" href="{{R}}leaderboard.html">Leaderboard →</a></div>
  <div class="ad-slot" style="padding:0" data-ad="sidebar"></div>
  <div class="card mt"><h3>Daily Logic Drop</h3><p>Get tomorrow's puzzle and solving tips by email.</p>
  <form data-form="Newsletter signup (game page)" data-success="Subscribed! See you tomorrow."><input type="email" name="email" placeholder="you@example.com" required aria-label="Email"><button class="btn btn-primary" style="width:100%" type="submit">Subscribe free</button></form></div>
  <div class="card mt"><h3>More games</h3><p class="mb0"><a href="{{R}}sudoku.html">Sudoku</a> · <a href="{{R}}code-breaker.html">Code Breaker</a> · <a href="{{R}}lights-out.html">Lights Out</a> · <a href="{{R}}tower-of-hanoi.html">Tower of Hanoi</a> · <a href="{{R}}number-sequences.html">Sequences</a> · <a href="{{R}}knights-and-knaves.html">Logic Challenges</a></p></div>
</aside>"""

def page(out, title, desc, h1, intro, board, howto, scripts, faq):
    meta = {"title": title, "desc": desc, "out": out, "scripts": scripts, "nav": "puzzles", "priority": "0.9",
            "jsonld": '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@type": "VideoGame", "name": h1, "url": "https://extralogic.com/" + out, "gamePlatform": "Web browser", "applicationCategory": "Game", "genre": "Puzzle", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}}) + "</script>"}
    faqh = "".join(f"<details><summary>{q}</summary><p>{a}</p></details>" for q, a in faq)
    html = f"""<!--{json.dumps(meta)}-->
<section class="page-hero"><div class="container"><div class="crumbs"><a href="{{{{R}}}}index.html">Home</a> / <a href="{{{{R}}}}puzzles.html">Puzzles</a> / {h1}</div>
<h1>{h1}</h1><p class="lead">{intro}</p></div></section>
<section style="padding-top:32px"><div class="container game-wrap">
<div>{board}
<div class="ad-slot" style="padding:0" data-ad="inContent"></div>
<article class="article" style="margin:0;max-width:none"><h2>How to play</h2>{howto}<h2>FAQ</h2>{faqh}</article></div>
{SIDEBAR}
</div></section>
"""
    open(os.path.join(D, out), "w").write(html)

BAR = '<button class="btn btn-ghost btn-sm" data-share>Share</button><span class="timer" aria-label="Timer">0:00</span>'

page("sudoku.html", "Free Daily Sudoku Online — Easy to Expert | ExtraLogic",
     "Play free daily Sudoku online with 4 difficulty levels, hints, error checking and a timer. New puzzle every day, no sign-up needed.",
     "Daily Sudoku", "Everyone gets the same daily grid at each difficulty, so you can compare times with friends, or play unlimited random grids.",
     f"""<div class="game-board" id="game-sudoku">
<div class="game-bar"><button class="btn btn-ghost btn-sm" data-diff="easy">Easy</button><button class="btn btn-dark btn-sm" data-diff="medium">Medium</button><button class="btn btn-ghost btn-sm" data-diff="hard">Hard</button><button class="btn btn-ghost btn-sm" data-diff="expert">Expert</button>{BAR}</div>
<p class="status small muted" aria-live="polite"></p>
<div class="sudoku" role="grid" aria-label="Sudoku board"></div><div class="numpad"></div>
<div class="game-bar mt" style="justify-content:center"><button class="btn btn-ghost btn-sm" data-daily>Daily grid</button><button class="btn btn-ghost btn-sm" data-new>New random</button><button class="btn btn-ghost btn-sm" data-check>Check errors</button><button class="btn btn-primary btn-sm" data-hint>Hint</button></div>
</div>""",
     "<p>Fill the 9×9 grid so every <b>row</b>, <b>column</b> and <b>3×3 box</b> contains the digits 1–9 exactly once. Click a cell, then tap a number or type it on your keyboard. Arrow keys move the selection; Backspace erases.</p><div class='callout'><b>Pro strategy:</b> start with 'naked singles', cells where only one digit fits. Then scan each box for 'hidden singles', digits that can go in only one cell of a row, column or box.</div>",
     ["games.js"],
     [("Does every puzzle have a unique solution?", "Yes. Each generated grid is checked for uniqueness before you see it."), ("When does the daily Sudoku change?", "At midnight in your local time zone."), ("Is there a printable version?", "Printable packs are coming with ExtraLogic Pro. Join the newsletter to hear first.")])

page("code-breaker.html", "Code Breaker — Free Mastermind Logic Game Online | ExtraLogic",
     "Crack the secret color code in 10 guesses. A free daily Mastermind-style deduction game with shareable results.",
     "Code Breaker", "A secret 4-color code is hidden. Each guess gets feedback pegs. Use deduction to crack it in as few guesses as possible.",
     f"""<div class="game-board" id="game-code">
<div class="game-bar"><span class="small">Guesses left: <b class="left">10</b></span>{BAR}</div>
<p class="status small muted" aria-live="polite"></p>
<div class="mm-rows"></div><div class="palette" aria-label="Color palette"></div>
<div class="game-bar" style="justify-content:center"><button class="btn btn-ghost btn-sm" data-undo>Undo</button><button class="btn btn-primary btn-sm" data-submit>Submit guess</button><button class="btn btn-ghost btn-sm" data-new>New code</button></div>
</div>""",
     "<p>Pick 4 colors and submit. A <b>black</b> peg means a correct color in the correct spot. A <b>white</b> peg means a correct color in the wrong spot. Colors can repeat.</p><div class='callout'><b>Strategy:</b> open with two pairs, like red-red-blue-blue. It tells you more than four different colors do.</div>",
     ["games.js"],
     [("Is it the same code for everyone?", "The daily code is the same worldwide. 'New code' gives you unlimited random practice."), ("What's the best possible score?", "Any 4-peg, 6-color code can be solved in 5 guesses or fewer with perfect play (Knuth, 1977).")])

page("lights-out.html", "Lights Out Puzzle — Play Free Online | ExtraLogic",
     "Play Lights Out free online. Tap a light to flip it and its neighbours, and turn every light off. Endless levels of rising difficulty.",
     "Lights Out", "Each tap toggles a light and its four neighbours. Switch the whole board off. Every level adds more lights.",
     f"""<div class="game-board" id="game-lights">
<div class="game-bar"><span class="small">Moves: <b class="moves">0</b></span>{BAR}</div>
<p class="status small muted" aria-live="polite"></p>
<div class="lights" aria-label="Lights Out board"></div>
<div class="game-bar mt" style="justify-content:center"><button class="btn btn-ghost btn-sm" data-reset>Restart at level 1</button><button class="btn btn-primary btn-sm" data-new>Random board</button></div>
</div>""",
     "<p>Tapping a square flips it and the squares above, below, left and right of it. Your goal is to turn every light off in as few moves as you can.</p><div class='callout'><b>Chase the lights:</b> clear row by row. Tap the square under each lit square in the row above until only the bottom row is left, then use known bottom-row patterns.</div>",
     ["games.js"],
     [("Is every board solvable?", "Yes. Boards are made by applying random taps to a solved board, so a solution always exists."), ("Where does the game come from?", "Lights Out was a 1995 handheld by Tiger Electronics. The maths behind it is linear algebra over GF(2).")])

page("tower-of-hanoi.html", "Tower of Hanoi — Play Online Free (3–8 Disks) | ExtraLogic",
     "Play the Tower of Hanoi puzzle online. Move the tower in the minimum number of moves with 3 to 8 disks. Learn the recursive solution.",
     "Tower of Hanoi", "Move the whole tower to the right peg, one disk at a time, never placing a larger disk on a smaller one.",
     f"""<div class="game-board" id="game-hanoi">
<div class="game-bar"><button class="btn btn-ghost btn-sm" data-disks="3">3</button><button class="btn btn-dark btn-sm" data-disks="4">4</button><button class="btn btn-ghost btn-sm" data-disks="5">5</button><button class="btn btn-ghost btn-sm" data-disks="6">6</button><button class="btn btn-ghost btn-sm" data-disks="8">8</button><span class="small">Moves: <b class="moves">0</b> / min <b class="min">15</b></span>{BAR}</div>
<p class="status small muted" aria-live="polite"></p>
<div class="hanoi"></div>
<div class="game-bar mt" style="justify-content:center"><button class="btn btn-primary btn-sm" data-new>Restart</button></div>
</div>""",
     "<p>Click a peg to pick up its top disk, then click another peg to drop it. The minimum number of moves for <i>n</i> disks is <b>2ⁿ − 1</b>.</p><div class='callout'><b>The recursive trick:</b> to move n disks, move n−1 disks out of the way, move the largest disk, then move the n−1 disks back on top.</div>",
     ["games.js"],
     [("Why is it used in computer science?", "It's the textbook example of recursion and exponential growth: 64 disks would take 2⁶⁴ − 1 moves."), ("Is there a pattern for odd and even disk counts?", "Yes. The smallest disk always cycles in the same direction, and which direction depends on whether n is odd or even.")])

QUIZ = lambda bank, game, title: f"""<div class="game-board q-card" data-quiz data-bank="{bank}" data-game="{game}" data-title="{title}" data-count="8">
<div class="game-bar"><span class="small muted">Daily set of 8</span>{BAR.replace('data-share','data-share-q')}</div>
<div class="qbar"><i style="width:0"></i></div><div class="q"></div><div class="options"></div><div class="exp" aria-live="polite"></div>
<button class="btn btn-primary" data-next style="display:none">Next →</button></div>"""

page("number-sequences.html", "Number Sequence Puzzles — Find the Next Number | ExtraLogic",
     "Free number sequence and pattern puzzles with explanations. Practice for aptitude tests, IQ tests and job assessments with a new daily set.",
     "Number Sequences", "Find the rule, predict the next term. A new set of 8 every day, with explanations for every answer.",
     QUIZ("XL_SEQUENCES", "sequences", "Number Sequences"),
     "<p>Look for differences between terms, ratios, squares and cubes, primes, alternating patterns and letter positions (A=1, B=2…). If the first differences aren't constant, check the second differences.</p>",
     ["data.js", "games.js"],
     [("Are these like real aptitude tests?", "Yes. Sequence questions are common in numerical and abstract reasoning tests used by employers.")])

page("knights-and-knaves.html", "Knights and Knaves & Logic Challenges with Answers | ExtraLogic",
     "Classic knights and knaves puzzles, syllogisms, logical fallacies and probability brain teasers with full explanations. New daily set.",
     "Knights, Knaves &amp; Logic Challenges", "Truth-tellers, liars, syllogisms, fallacies and famous probability traps, each with a clear explanation.",
     QUIZ("XL_LOGIC", "logic", "Logic Challenges"),
     "<p>Knights always tell the truth; knaves always lie. Assume a character is a knight and follow the consequences. If you reach a contradiction, they must be a knave. For syllogisms, draw the sets as circles.</p>",
     ["data.js", "games.js"],
     [("Who invented knights and knaves?", "Logician Raymond Smullyan made them famous in 'What Is the Name of This Book?' (1978)."), ("Want harder ones?", "Our monthly contests feature multi-person liar puzzles. See the Contests page.")])
print("games generated")
