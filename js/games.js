/* ExtraLogic.com — playable logic games (vanilla JS) */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function Timer(el) {
    var t = 0, h = null;
    return { start: function () { this.stop(); t = 0; el && (el.textContent = "0:00"); h = setInterval(function () { t++; el && (el.textContent = XL.fmtTime(t)); }, 1000); },
      stop: function () { clearInterval(h); h = null; }, get: function () { return t; } };
  }
  function shuffle(a, rnd) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function win(game, secs, text) {
    var s = XL.markSolved(game, secs);
    XL.track("level_end", { game: game, success: true, seconds: secs });
    return "🔥 Streak: " + s.count + " day" + (s.count === 1 ? "" : "s");
  }

  /* ============ SUDOKU ============ */
  function initSudoku(root) {
    var boardEl = $(".sudoku", root), padEl = $(".numpad", root), timer = Timer($(".timer", root));
    var grid, solution, given, sel = -1, mode = "daily", diff = "medium";
    var holes = { easy: 36, medium: 46, hard: 53, expert: 55 };
    function ok(g, i, n) { var r = Math.floor(i / 9), c = i % 9, br = r - r % 3, bc = c - c % 3;
      for (var k = 0; k < 9; k++) { if (g[r * 9 + k] === n || g[k * 9 + c] === n || g[(br + Math.floor(k / 3)) * 9 + bc + k % 3] === n) return false; } return true; }
    function fill(g, rnd) { var i = g.indexOf(0); if (i < 0) return true; var ns = shuffle([1,2,3,4,5,6,7,8,9], rnd);
      for (var k = 0; k < 9; k++) { if (ok(g, i, ns[k])) { g[i] = ns[k]; if (fill(g, rnd)) return true; g[i] = 0; } } return false; }
    function count(g, lim) { var i = g.indexOf(0); if (i < 0) return 1; var c = 0;
      for (var n = 1; n <= 9 && c < lim; n++) { if (ok(g, i, n)) { g[i] = n; c += count(g, lim - c); g[i] = 0; } } return c; }
    function newGame() {
      var seed = mode === "daily" ? XL.dayNumber() * 7919 + Object.keys(holes).indexOf(diff) * 104729 : Math.floor(Math.random() * 1e9);
      var rnd = XL.seeded(seed); solution = new Array(81).fill(0); fill(solution, rnd);
      grid = solution.slice(); var order = shuffle([].concat(Array.from({ length: 81 }, function (_, i) { return i; })), rnd), removed = 0;
      for (var k = 0; k < 81 && removed < holes[diff]; k++) { var i = order[k], b = grid[i]; grid[i] = 0;
        if (count(grid.slice(), 2) !== 1) grid[i] = b; else removed++; }
      given = grid.map(function (v) { return v > 0; }); sel = -1; render(); timer.start();
      $(".status", root).textContent = (mode === "daily" ? "Daily puzzle · " + XL.today() : "Random puzzle") + " · " + diff;
    }
    function render() {
      boardEl.innerHTML = "";
      var sr = Math.floor(sel / 9), sc = sel % 9;
      grid.forEach(function (v, i) {
        var d = document.createElement("div"), r = Math.floor(i / 9), c = i % 9;
        d.textContent = v || ""; d.setAttribute("role", "gridcell"); d.setAttribute("aria-label", "Row " + (r + 1) + " column " + (c + 1) + (v ? " value " + v : " empty"));
        if (given[i]) d.className = "given"; else if (v) d.className = "user" + (v !== solution[i] && root.dataset.check === "1" ? " bad" : "");
        if (sel >= 0 && i !== sel && (r === sr || c === sc || (Math.floor(r / 3) === Math.floor(sr / 3) && Math.floor(c / 3) === Math.floor(sc / 3)))) d.classList.add("peer");
        if (i === sel) d.classList.add("sel");
        d.addEventListener("click", function () { sel = i; render(); });
        boardEl.appendChild(d);
      });
    }
    function put(n) {
      if (sel < 0 || given[sel]) return; grid[sel] = n; render();
      if (grid.indexOf(0) < 0) {
        var solved = grid.every(function (v, i) { return ok(grid.map(function (x, j) { return j === i ? 0 : x; }), i, v); });
        if (solved) { timer.stop(); var t = timer.get(); var st = win("sudoku", t);
          $(".status", root).innerHTML = "<b>Solved in " + XL.fmtTime(t) + "!</b> " + st;
          root.dataset.lastResult = "I solved today's ExtraLogic " + diff + " Sudoku in " + XL.fmtTime(t) + " 🧠"; XL.toast("Solved! " + st); }
        else XL.toast("Board full, but something conflicts. Try Check.");
      }
    }
    for (var n = 1; n <= 9; n++) (function (n) { var b = document.createElement("button"); b.textContent = n; b.addEventListener("click", function () { put(n); }); padEl.appendChild(b); })(n);
    var er = document.createElement("button"); er.textContent = "⌫"; er.setAttribute("aria-label", "Erase"); er.addEventListener("click", function () { put(0); }); padEl.appendChild(er);
    document.addEventListener("keydown", function (e) {
      if (!root.isConnected || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (e.key >= "1" && e.key <= "9") put(+e.key); else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") put(0);
      else if (sel >= 0 && /Arrow/.test(e.key)) { e.preventDefault(); sel = (sel + { ArrowUp: -9, ArrowDown: 9, ArrowLeft: -1, ArrowRight: 1 }[e.key] + 81) % 81; render(); }
    });
    root.querySelectorAll("[data-diff]").forEach(function (b) { b.addEventListener("click", function () { diff = b.dataset.diff; root.querySelectorAll("[data-diff]").forEach(function (x) { x.classList.toggle("btn-dark", x === b); x.classList.toggle("btn-ghost", x !== b); }); newGame(); }); });
    $("[data-new]", root).addEventListener("click", function () { mode = "random"; newGame(); });
    $("[data-daily]", root).addEventListener("click", function () { mode = "daily"; newGame(); });
    $("[data-check]", root).addEventListener("click", function () { root.dataset.check = "1"; render(); setTimeout(function () { root.dataset.check = "0"; render(); }, 2500); });
    $("[data-hint]", root).addEventListener("click", function () {
      var empties = grid.map(function (v, i) { return !v || v !== solution[i] ? i : -1; }).filter(function (i) { return i >= 0 && !given[i]; });
      if (!empties.length) return; var i = sel >= 0 && empties.indexOf(sel) >= 0 ? sel : empties[Math.floor(Math.random() * empties.length)];
      sel = i; put(solution[i]); XL.toast("Hint used — cell revealed.");
    });
    $("[data-share]", root).addEventListener("click", function () { XL.share(root.dataset.lastResult || "I'm playing the daily Sudoku on ExtraLogic 🧠"); });
    newGame();
  }

  /* ============ LIGHTS OUT ============ */
  function initLights(root) {
    var board = $(".lights", root), movesEl = $(".moves", root), timer = Timer($(".timer", root)), N = 5, state, moves, level = 1;
    function toggle(i) { var r = Math.floor(i / N), c = i % N; [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(function (d) { var rr = r + d[0], cc = c + d[1]; if (rr >= 0 && rr < N && cc >= 0 && cc < N) state[rr * N + cc] ^= 1; }); }
    function newGame(daily) {
      var rnd = XL.seeded(daily ? XL.dayNumber() * 31 + level : Math.random() * 1e9); state = new Array(N * N).fill(0); moves = 0;
      var presses = 3 + level * 2; for (var k = 0; k < presses; k++) toggle(Math.floor(rnd() * N * N));
      if (state.every(function (v) { return !v; })) toggle(12);
      render(); timer.start(); $(".status", root).textContent = "Level " + level + " · turn every light off";
    }
    function render() {
      board.innerHTML = ""; movesEl.textContent = moves;
      state.forEach(function (v, i) { var b = document.createElement("button"); b.className = v ? "on" : ""; b.setAttribute("aria-label", "Light " + (i + 1) + (v ? " on" : " off"));
        b.addEventListener("click", function () { toggle(i); moves++; render(); check(); }); board.appendChild(b); });
    }
    function check() { if (state.every(function (v) { return !v; })) { timer.stop(); var st = win("lights-out", timer.get());
      $(".status", root).innerHTML = "<b>Level " + level + " cleared in " + moves + " moves!</b> " + st; root.dataset.lastResult = "Cleared ExtraLogic Lights Out level " + level + " in " + moves + " moves 💡";
      level++; setTimeout(function () { newGame(true); }, 1600); } }
    $("[data-new]", root).addEventListener("click", function () { newGame(false); });
    $("[data-reset]", root).addEventListener("click", function () { level = 1; newGame(true); });
    $("[data-share]", root).addEventListener("click", function () { XL.share(root.dataset.lastResult || "Playing Lights Out on ExtraLogic 💡"); });
    newGame(true);
  }

  /* ============ TOWER OF HANOI ============ */
  function initHanoi(root) {
    var pegsEl = $(".hanoi", root), movesEl = $(".moves", root), minEl = $(".min", root), timer = Timer($(".timer", root));
    var n = 4, pegs, sel = null, moves, colors = ["#ff9f1c", "#11a88f", "#3f51f5", "#e5484d", "#9b5de5", "#00bbf9", "#f15bb5", "#8ac926"];
    function newGame() { pegs = [[], [], []]; for (var i = n; i >= 1; i--) pegs[0].push(i); moves = 0; sel = null; minEl.textContent = Math.pow(2, n) - 1; render(); timer.start(); $(".status", root).textContent = "Move all " + n + " disks to the right peg."; }
    function render() {
      pegsEl.innerHTML = ""; movesEl.textContent = moves;
      pegs.forEach(function (p, pi) {
        var el = document.createElement("div"); el.className = "peg" + (sel === pi ? " sel" : ""); el.setAttribute("role", "button"); el.tabIndex = 0; el.setAttribute("aria-label", "Peg " + (pi + 1) + ", " + p.length + " disks");
        p.forEach(function (d) { var dk = document.createElement("div"); dk.className = "disk"; dk.style.width = (20 + d * (70 / n)) + "%"; dk.style.background = colors[(d - 1) % colors.length]; el.appendChild(dk); });
        el.addEventListener("click", function () { click(pi); }); el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") click(pi); });
        pegsEl.appendChild(el);
      });
    }
    function click(pi) {
      if (sel === null) { if (pegs[pi].length) sel = pi; }
      else { if (pi !== sel) { var a = pegs[sel], b = pegs[pi], d = a[a.length - 1];
        if (!b.length || b[b.length - 1] > d) { b.push(a.pop()); moves++; } else XL.toast("A larger disk can't go on a smaller one."); }
        sel = null; }
      render();
      if (pegs[2].length === n) { timer.stop(); var min = Math.pow(2, n) - 1, st = win("hanoi", timer.get());
        $(".status", root).innerHTML = "<b>Solved in " + moves + " moves" + (moves === min ? " — PERFECT!" : " (optimal is " + min + ")") + "</b> " + st;
        root.dataset.lastResult = "Tower of Hanoi (" + n + " disks) in " + moves + " moves on ExtraLogic 🗼"; }
    }
    root.querySelectorAll("[data-disks]").forEach(function (b) { b.addEventListener("click", function () { n = +b.dataset.disks; root.querySelectorAll("[data-disks]").forEach(function (x) { x.classList.toggle("btn-dark", x === b); x.classList.toggle("btn-ghost", x !== b); }); newGame(); }); });
    $("[data-new]", root).addEventListener("click", newGame);
    $("[data-share]", root).addEventListener("click", function () { XL.share(root.dataset.lastResult || "Playing Tower of Hanoi on ExtraLogic 🗼"); });
    newGame();
  }

  /* ============ CODE BREAKER (Mastermind) ============ */
  function initCode(root) {
    var COLORS = ["#e5484d", "#ff9f1c", "#f5d90a", "#11a88f", "#3f51f5", "#9b5de5"], L = 4, MAX = 10;
    var rowsEl = $(".mm-rows", root), palEl = $(".palette", root), timer = Timer($(".timer", root)), secret, guesses, cur, done;
    function newGame(daily) { var rnd = XL.seeded(daily ? XL.dayNumber() * 131 + 7 : Math.random() * 1e9); secret = []; for (var i = 0; i < L; i++) secret.push(Math.floor(rnd() * 6)); guesses = []; cur = []; done = false; render(); timer.start(); $(".status", root).textContent = (daily ? "Daily code" : "Random code") + " · " + MAX + " guesses"; }
    function score(g) { var b = 0, w = 0, s = secret.slice(), gg = g.slice(); for (var i = 0; i < L; i++) if (gg[i] === s[i]) { b++; s[i] = gg[i] = -1; }
      for (i = 0; i < L; i++) if (gg[i] >= 0) { var j = s.indexOf(gg[i]); if (j >= 0) { w++; s[j] = -1; } } return [b, w]; }
    function row(g, fb) { var r = document.createElement("div"); r.className = "mm-row";
      for (var i = 0; i < L; i++) { var d = document.createElement("span"); d.className = "peg-dot"; if (g[i] !== undefined) d.style.background = COLORS[g[i]]; r.appendChild(d); }
      var f = document.createElement("span"); f.className = "fb"; for (i = 0; i < L; i++) { var k = document.createElement("i"); if (fb) { if (i < fb[0]) k.className = "b"; else if (i < fb[0] + fb[1]) k.className = "w"; } f.appendChild(k); }
      r.appendChild(f); return r; }
    function render() { rowsEl.innerHTML = ""; guesses.forEach(function (g) { rowsEl.appendChild(row(g.g, g.f)); }); if (!done) rowsEl.appendChild(row(cur)); $(".left", root).textContent = MAX - guesses.length; }
    COLORS.forEach(function (c, i) { var b = document.createElement("button"); b.style.background = c; b.setAttribute("aria-label", "Color " + (i + 1)); b.addEventListener("click", function () { if (!done && cur.length < L) { cur.push(i); render(); } }); palEl.appendChild(b); });
    $("[data-undo]", root).addEventListener("click", function () { cur.pop(); render(); });
    $("[data-submit]", root).addEventListener("click", function () {
      if (done || cur.length < L) { XL.toast("Pick " + L + " colors first."); return; }
      var f = score(cur); guesses.push({ g: cur, f: f }); cur = [];
      if (f[0] === L) { done = true; timer.stop(); var st = win("code-breaker", timer.get()); $(".status", root).innerHTML = "<b>Cracked in " + guesses.length + " guesses!</b> " + st;
        root.dataset.lastResult = "Cracked the ExtraLogic daily code in " + guesses.length + "/" + MAX + " 🔐\n" + guesses.map(function (g) { return "⚫".repeat(g.f[0]) + "⚪".repeat(g.f[1]) + "·".repeat(L - g.f[0] - g.f[1]); }).join("\n"); }
      else if (guesses.length >= MAX) { done = true; timer.stop(); $(".status", root).innerHTML = "<b>Out of guesses.</b> The code is shown below."; guesses.push({ g: secret, f: [L, 0] }); }
      render();
    });
    $("[data-new]", root).addEventListener("click", function () { newGame(false); });
    $("[data-share]", root).addEventListener("click", function () { XL.share(root.dataset.lastResult || "Playing Code Breaker on ExtraLogic 🔐"); });
    newGame(true);
  }

  /* ============ QUIZ ENGINE (sequences, knights & knaves, riddles) ============ */
  function initQuiz(root) {
    var bank = window[root.dataset.bank] || [], per = +(root.dataset.count || 8), timer = Timer($(".timer", root));
    var qs, i, score, qEl = $(".q", root), optEl = $(".options", root), expEl = $(".exp", root), barEl = $(".qbar i", root), nextBtn = $("[data-next]", root);
    function start(daily) { var rnd = XL.seeded(daily ? XL.dayNumber() * 17 + bank.length : Math.random() * 1e9); qs = shuffle(bank.slice(), rnd).slice(0, per); i = 0; score = 0; timer.start(); show(); }
    function show() {
      barEl.style.width = (i / qs.length * 100) + "%"; expEl.innerHTML = ""; nextBtn.style.display = "none";
      if (i >= qs.length) return finish();
      var q = qs[i]; qEl.innerHTML = "<span class='muted small'>Question " + (i + 1) + " of " + qs.length + "</span><h3 style='margin-top:6px'>" + q.q + "</h3>";
      optEl.innerHTML = "";
      q.o.forEach(function (o, k) { var b = document.createElement("button"); b.textContent = o; b.addEventListener("click", function () { answer(k, b); }); optEl.appendChild(b); });
    }
    function answer(k, b) {
      var q = qs[i]; optEl.querySelectorAll("button").forEach(function (x, j) { x.disabled = true; if (j === q.a) x.classList.add("right"); });
      if (k === q.a) score++; else b.classList.add("wrong");
      expEl.innerHTML = "<div class='callout'><b>" + (k === q.a ? "Correct. " : "Not quite. ") + "</b>" + (q.e || "") + "</div>";
      nextBtn.style.display = "inline-flex"; nextBtn.focus();
    }
    function finish() {
      timer.stop(); barEl.style.width = "100%"; optEl.innerHTML = "";
      var pct = Math.round(score / qs.length * 100), st = score >= Math.ceil(qs.length * .6) ? win(root.dataset.game, timer.get()) : "Score 60%+ to extend your streak.";
      qEl.innerHTML = "<div class='center'><div class='result-big'>" + score + "/" + qs.length + "</div><p>" + pct + "% in " + XL.fmtTime(timer.get()) + " · " + st + "</p></div>";
      root.dataset.lastResult = "I scored " + score + "/" + qs.length + " on ExtraLogic " + (root.dataset.title || "logic") + " 🧠";
      expEl.innerHTML = "<div class='center'><button class='btn btn-primary' data-again>Play again</button> <button class='btn btn-ghost' data-share2>Share score</button></div>";
      $("[data-again]", root).addEventListener("click", function () { start(false); });
      $("[data-share2]", root).addEventListener("click", function () { XL.share(root.dataset.lastResult); });
    }
    nextBtn.addEventListener("click", function () { i++; show(); });
    var sq = $("[data-share-q]", root); if (sq) sq.addEventListener("click", function () { XL.share(root.dataset.lastResult || "Testing my logic on ExtraLogic 🧠"); });
    start(true);
  }

  /* ============ DAILY RIDDLE (homepage widget) ============ */
  function initRiddle(root) {
    var bank = window.XL_RIDDLES || []; if (!bank.length) return;
    var r = bank[XL.dayNumber() % bank.length], key = "riddle_" + XL.today();
    $(".rq", root).textContent = r.q;
    var input = $("input", root), out = $(".rout", root), tries = 0;
    function norm(s) { return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\b(a|an|the)\b/g, "").replace(/\s+/g, " ").trim(); }
    function reveal(ok) { out.innerHTML = (ok ? "<b style='color:#5ae3c7'>✓ Correct!</b> " : "<b>Answer:</b> ") + r.a + (r.e ? " — <span class='muted'>" + r.e + "</span>" : ""); input.disabled = true; }
    if (XL.store.get(key, false)) reveal(true);
    $("form", root).addEventListener("submit", function (e) { e.preventDefault();
      var g = norm(input.value); if (!g) return; tries++;
      if (r.k.some(function (k) { var nk = norm(k); return nk.length <= 2 ? (" " + g + " ").indexOf(" " + nk + " ") >= 0 : g.indexOf(nk) >= 0; })) { XL.store.set(key, true); var s = XL.markSolved("riddle", tries * 20); reveal(true); XL.toast("Solved! Streak: " + s.count); }
      else { out.textContent = "Not it — try again (" + tries + " " + (tries === 1 ? "try" : "tries") + ")."; }
    });
    $("[data-reveal]", root).addEventListener("click", function () { reveal(false); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var m = { "game-sudoku": initSudoku, "game-lights": initLights, "game-hanoi": initHanoi, "game-code": initCode, "daily-riddle": initRiddle };
    Object.keys(m).forEach(function (id) { var el = document.getElementById(id); if (el) m[id](el); });
    document.querySelectorAll("[data-quiz]").forEach(initQuiz);
  });
})();
