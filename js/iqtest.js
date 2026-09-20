/* ExtraLogic Reasoning Test — 20 timed questions; a free score, then the full report unlocks after email (lead capture) */
(function () {
  "use strict";
  var Q = [
    { c: "Numerical", q: "What comes next: 2, 5, 10, 17, 26, ?", o: ["35", "37", "36", "39"], a: 1 },
    { c: "Numerical", q: "A shirt costs $40 after a 20% discount. What was the original price?", o: ["$48", "$50", "$52", "$60"], a: 1 },
    { c: "Numerical", q: "If 3 pencils cost 45¢, how much do 8 pencils cost?", o: ["$1.05", "$1.20", "$1.35", "$1.10"], a: 1 },
    { c: "Numerical", q: "Which number is the odd one out: 9, 25, 49, 81, 105, 121?", o: ["25", "81", "105", "121"], a: 2 },
    { c: "Numerical", q: "A train travels 180 km in 2 h 15 min. What is its average speed?", o: ["75 km/h", "80 km/h", "85 km/h", "90 km/h"], a: 1 },
    { c: "Verbal", q: "BOOK is to READ as FORK is to:", o: ["Kitchen", "Eat", "Spoon", "Metal"], a: 1 },
    { c: "Verbal", q: "Which word does NOT belong: Violin, Cello, Flute, Viola, Double bass?", o: ["Violin", "Cello", "Flute", "Viola"], a: 2 },
    { c: "Verbal", q: "Choose the word closest in meaning to 'OBSTINATE':", o: ["Stubborn", "Obvious", "Hidden", "Fragile"], a: 0 },
    { c: "Verbal", q: "Rearrange 'CIFAIPC' to make a:", o: ["City", "Ocean", "Animal", "Country"], a: 1 },
    { c: "Verbal", q: "HAND is to GLOVE as HEAD is to:", o: ["Hair", "Hat", "Neck", "Brain"], a: 1 },
    { c: "Pattern", q: "Grid rows: [1, 2, 3] · [2, 4, 6] · [3, 6, ?]. What is missing?", o: ["8", "9", "12", "7"], a: 1 },
    { c: "Pattern", q: "Shapes cycle: ▲ ■ ● ▲ ■ ● ▲ ■ ?", o: ["▲", "■", "●", "◆"], a: 2 },
    { c: "Pattern", q: "Which pair continues the pattern: AZ, BY, CX, ?", o: ["DW", "DV", "EW", "DX"], a: 0 },
    { c: "Pattern", q: "Mirror logic: 'b' mirrored left-right becomes:", o: ["d", "p", "q", "b"], a: 0 },
    { c: "Pattern", q: "A cube is painted on all sides and cut into 27 equal cubes. How many small cubes have exactly 2 painted faces?", o: ["8", "12", "6", "4"], a: 1 },
    { c: "Deductive", q: "All managers are trained. Some trained people are engineers. Which is certain?", o: ["Some managers are engineers", "All engineers are trained", "Neither statement is certain", "No managers are engineers"], a: 2 },
    { c: "Deductive", q: "Tom is older than Ann. Ann is older than Lee. Lee is older than Kim. Who is the youngest?", o: ["Tom", "Ann", "Lee", "Kim"], a: 3 },
    { c: "Deductive", q: "If no reptiles have fur, and all snakes are reptiles, then:", o: ["Some snakes have fur", "No snakes have fur", "All furry animals are snakes", "Cannot tell"], a: 1 },
    { c: "Deductive", q: "Five people sit in a row. P is at one end. Q is next to P. R is in the middle. Who sits in seat 2 if P is in seat 1?", o: ["R", "Q", "S", "Cannot tell"], a: 1 },
    { c: "Deductive", q: "If today is Wednesday, what day is it 100 days from now?", o: ["Thursday", "Friday", "Saturday", "Sunday"], a: 1 }
  ];
  var LIMIT = 15 * 60;
  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("reasoning-test"); if (!root) return;
    var intro = root.querySelector(".t-intro"), run = root.querySelector(".t-run"), res = root.querySelector(".t-result");
    var qEl = run.querySelector(".q"), oEl = run.querySelector(".options"), bar = run.querySelector(".qbar i"), clock = run.querySelector(".timer");
    var i = 0, answers = [], left = LIMIT, h;
    root.querySelector("[data-start]").addEventListener("click", function () {
      intro.style.display = "none"; run.style.display = "block"; i = 0; answers = []; left = LIMIT; show();
      h = setInterval(function () { left--; clock.textContent = XL.fmtTime(Math.max(left, 0)); if (left <= 0) finish(); }, 1000);
      XL.track("test_start");
    });
    function show() {
      if (i >= Q.length) return finish();
      bar.style.width = (i / Q.length * 100) + "%";
      var q = Q[i]; qEl.innerHTML = "<span class='tag'>" + q.c + "</span><span class='muted small'>Question " + (i + 1) + " / " + Q.length + "</span><h3 style='margin-top:10px'>" + q.q + "</h3>";
      oEl.innerHTML = "";
      q.o.forEach(function (o, k) { var b = document.createElement("button"); b.textContent = String.fromCharCode(65 + k) + ".  " + o; b.addEventListener("click", function () { answers[i] = k; i++; show(); }); oEl.appendChild(b); });
    }
    function finish() {
      clearInterval(h); run.style.display = "none"; res.style.display = "block";
      var correct = 0, cats = {}; Q.forEach(function (q, k) { cats[q.c] = cats[q.c] || [0, 0]; cats[q.c][1]++; if (answers[k] === q.a) { correct++; cats[q.c][0]++; } });
      var used = LIMIT - Math.max(left, 0), speed = used < 420 ? 3 : used < 660 ? 1 : 0;
      var score = Math.min(150, Math.round(70 + correct * 3.4 + (correct >= 12 ? speed : 0)));
      var band = score >= 130 ? "Exceptional" : score >= 115 ? "Strong" : score >= 100 ? "Above average" : score >= 88 ? "Average" : "Developing";
      res.querySelector("[data-score]").textContent = score;
      res.querySelector("[data-band]").textContent = band;
      res.querySelector("[data-correct]").textContent = correct + " / " + Q.length + " correct · " + XL.fmtTime(used);
      var hidden = res.querySelector("[name=test_result]"); if (hidden) hidden.value = "Score " + score + " (" + band + "), " + correct + "/20, time " + XL.fmtTime(used) + " | " + Object.keys(cats).map(function (c) { return c + " " + cats[c][0] + "/" + cats[c][1]; }).join(", ");
      var rep = res.querySelector(".t-report");
      rep.innerHTML = "<h3>Your full breakdown</h3>" + Object.keys(cats).map(function (c) { var p = Math.round(cats[c][0] / cats[c][1] * 100);
        return "<div class='mt'><b>" + c + " reasoning</b> <span class='muted'>" + cats[c][0] + "/" + cats[c][1] + "</span><div class='progress'><i style='width:" + Math.max(p, 3) + "%'></i></div><p class='small muted'>" + tip(c, p) + "</p></div>"; }).join("") +
        "<h3 class='mt'>Answer review</h3><ol class='small'>" + Q.map(function (q, k) { var ok = answers[k] === q.a; return "<li>" + (ok ? "✅ " : "❌ ") + q.q + " <b>Answer: " + q.o[q.a] + "</b></li>"; }).join("") + "</ol>";
      if (correct >= 12) XL.markSolved("reasoning-test", used);
      res.dataset.share = "My ExtraLogic Reasoning Score: " + score + " (" + band + ") 🧠 Can you beat it?";
      XL.track("test_complete", { score: score });
    }
    function tip(c, p) {
      var t = { Numerical: "Practice: number sequences and mental percentages.", Verbal: "Practice: analogies and odd-one-out sets.", Pattern: "Practice: Sudoku, Lights Out and matrix puzzles.", Deductive: "Practice: Knights & Knaves and the fallacy guides." };
      return (p >= 80 ? "Excellent. " : p >= 50 ? "Solid, with room to grow. " : "Your biggest growth area. ") + t[c];
    }
    var form = res.querySelector("form");
    if (form) form.addEventListener("xl:sent", function () { res.querySelector(".t-report").style.display = "block"; res.querySelector(".t-gate").style.display = "none"; });
    var skip = res.querySelector("[data-unlock-anyway]");
    if (skip) skip.addEventListener("click", function (e) { e.preventDefault(); res.querySelector(".t-report").style.display = "block"; });
    res.querySelector("[data-share]").addEventListener("click", function () { XL.share(res.dataset.share); });
    res.querySelector("[data-retake]").addEventListener("click", function () { location.reload(); });
  });
})();
