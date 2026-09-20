/* ExtraLogic.com — core site script (no dependencies) */
(function () {
  "use strict";
  var C = window.XL_CONFIG || {};
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("xl_" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("xl_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  window.XL = window.XL || {};
  XL.store = store;

  /* ---------- hidden contact route ---------- */
  function addr() { try { return atob(C.contactToken || "").split("").reverse().join(""); } catch (e) { return ""; } }
  function endpoint() { return "https://formsubmit.co/ajax/" + (C.formsubmitAlias || addr()); }
  XL.openMail = function (subject, body) {
    var a = addr(); if (!a) return;
    window.location.href = "mailto:" + a + "?subject=" + encodeURIComponent(subject || "ExtraLogic inquiry") + (body ? "&body=" + encodeURIComponent(body) : "");
  };

  /* ---------- toast ---------- */
  var toastEl;
  XL.toast = function (msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  };

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var saved = store.get("theme", null);
  if (saved) root.setAttribute("data-theme", saved);
  else if (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) root.setAttribute("data-theme", "dark");

  /* ---------- day key + streaks (shared by games) ---------- */
  XL.today = function () { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  XL.dayNumber = function () { return Math.floor((Date.now() - new Date(2026, 0, 1).getTime()) / 864e5); };
  XL.seeded = function (seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e9) / 1e9; }; };
  XL.markSolved = function (game, seconds) {
    var t = XL.today(), s = store.get("streak", { last: null, count: 0, best: 0 });
    var y = new Date(Date.now() - 864e5); var yk = y.getFullYear() + "-" + String(y.getMonth() + 1).padStart(2, "0") + "-" + String(y.getDate()).padStart(2, "0");
    if (s.last !== t) { s.count = s.last === yk ? s.count + 1 : 1; s.last = t; s.best = Math.max(s.best, s.count); store.set("streak", s); }
    var solved = store.get("solved", {}); solved[game] = (solved[game] || 0) + 1; store.set("solved", solved);
    var pts = store.get("points", 0) + Math.max(10, 100 - Math.floor((seconds || 60) / 6)); store.set("points", pts);
    var hist = store.get("history", []); hist.unshift({ g: game, d: t, s: seconds || 0 }); store.set("history", hist.slice(0, 50));
    renderStreak(); return s;
  };
  function renderStreak() {
    var s = store.get("streak", { count: 0, best: 0 }), pts = store.get("points", 0);
    document.querySelectorAll("[data-streak]").forEach(function (el) { el.textContent = s.count || 0; });
    document.querySelectorAll("[data-best]").forEach(function (el) { el.textContent = s.best || 0; });
    document.querySelectorAll("[data-points]").forEach(function (el) { el.textContent = pts; });
  }
  XL.share = function (text) {
    var url = location.href.split("#")[0];
    if (navigator.share) { navigator.share({ title: "ExtraLogic", text: text, url: url }).catch(function () {}); return; }
    var full = text + "\n" + url;
    if (navigator.clipboard) navigator.clipboard.writeText(full).then(function () { XL.toast("Result copied — paste it anywhere!"); });
    else prompt("Copy your result:", full);
  };
  XL.fmtTime = function (s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

  document.addEventListener("DOMContentLoaded", function () {
    /* theme toggle */
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var n = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", n); store.set("theme", n);
      });
    });
    /* mobile nav */
    var mb = document.querySelector(".menu-btn"), nl = document.querySelector(".nav-links");
    if (mb && nl) mb.addEventListener("click", function () { var o = nl.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
    /* domain inquiry link */
    document.querySelectorAll("[data-domain-link]").forEach(function (a) { a.href = C.domainInquiryUrl || "https://web.works/contact"; });
    /* hidden email links */
    document.querySelectorAll("[data-mail]").forEach(function (a) {
      a.setAttribute("href", "#contact");
      a.addEventListener("click", function (e) { e.preventDefault(); XL.openMail(a.getAttribute("data-mail")); });
    });
    /* year */
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
    renderStreak();

    /* social + youtube links */
    document.querySelectorAll("[data-social]").forEach(function (a) { var k = a.getAttribute("data-social"); if (C.social && C.social[k]) a.href = C.social[k]; });
    document.querySelectorAll("[data-yt-sub]").forEach(function (a) { a.href = C.youtubeSubscribeUrl; });
    document.querySelectorAll("[data-yt-channel]").forEach(function (a) { a.href = C.youtubeChannelUrl; });

    /* lite YouTube embeds (fast pages = better ad viewability + SEO) */
    document.querySelectorAll("[data-yt]").forEach(function (box) {
      var id = box.getAttribute("data-yt");
      var b = document.createElement("button"); b.className = "yt-lite"; b.setAttribute("aria-label", "Play video: " + (box.getAttribute("data-title") || ""));
      b.style.backgroundImage = "url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
      b.addEventListener("click", function () {
        box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="' + (box.getAttribute("data-title") || "Video") + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      });
      box.appendChild(b);
    });

    /* reveal on scroll */
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: .08 });
      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });

    initConsent(); initForms(); initDonate(); initFund();
  });

  /* ---------- consent, ads, analytics ---------- */
  function initConsent() {
    var c = store.get("consent", null), bar = document.querySelector(".consent");
    if (c === null && bar) {
      bar.classList.add("show");
      bar.querySelector("[data-accept]").addEventListener("click", function () { store.set("consent", true); bar.classList.remove("show"); loadThirdParty(true); });
      bar.querySelector("[data-decline]").addEventListener("click", function () { store.set("consent", false); bar.classList.remove("show"); loadThirdParty(false); });
    }
    loadThirdParty(c === true);
  }
  var adsLoaded = false;
  function loadThirdParty(personalized) {
    var slots = document.querySelectorAll("[data-ad]");
    if (C.adsenseClient && !adsLoaded) {
      adsLoaded = true;
      window.adsbygoogle = window.adsbygoogle || [];
      if (!personalized) window.adsbygoogle.requestNonPersonalizedAds = 1;
      var s = document.createElement("script"); s.async = true; s.crossOrigin = "anonymous";
      s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + C.adsenseClient;
      document.head.appendChild(s);
      slots.forEach(function (slot) {
        var type = slot.getAttribute("data-ad"), id = (C.adSlots || {})[type] || "";
        slot.innerHTML = '<div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="' + C.adsenseClient + '"' + (id ? ' data-ad-slot="' + id + '"' : "") + ' data-ad-format="auto" data-full-width-responsive="true"></ins>';
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      });
    } else if (!C.adsenseClient) {
      var prefix = document.body.getAttribute("data-root") || "";
      slots.forEach(function (slot) {
        if (slot.dataset.filled) return; slot.dataset.filled = 1;
        slot.innerHTML = '<a class="ad-box" href="' + prefix + 'advertise.html"><small>Sponsored placement available</small><strong>Put your brand in front of problem-solvers →</strong><span>Advertise on ExtraLogic</span></a>';
      });
    }
    if (C.gaMeasurementId && personalized && !window.gtag) {
      var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + C.gaMeasurementId; document.head.appendChild(g);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); }; gtag("js", new Date()); gtag("config", C.gaMeasurementId);
    }
  }
  XL.track = function (name, params) { if (window.gtag) gtag("event", name, params || {}); };

  /* ---------- forms: every form posts to the hidden inbox ---------- */
  function initForms() {
    document.querySelectorAll("form[data-form]").forEach(function (f) {
      if (!f.querySelector(".hp")) { var h = document.createElement("input"); h.type = "text"; h.name = "_honey"; h.className = "hp"; h.tabIndex = -1; h.autocomplete = "off"; h.setAttribute("aria-hidden", "true"); f.appendChild(h); }
      var msg = f.querySelector(".form-msg"); if (!msg) { msg = document.createElement("div"); msg.className = "form-msg"; msg.setAttribute("role", "status"); f.appendChild(msg); }
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        if (f.querySelector(".hp").value) return;
        var btn = f.querySelector("[type=submit]"), label = btn ? btn.innerHTML : "";
        var fd = new FormData(f), data = {};
        fd.forEach(function (v, k) { if (k !== "_honey") data[k] = data[k] ? data[k] + ", " + v : v; });
        var kind = f.getAttribute("data-form");
        data._subject = "[ExtraLogic] " + kind + (data.name ? " — " + data.name : "");
        data._template = "table"; data._captcha = "false";
        data["Form type"] = kind; data["Page"] = location.href; data["Submitted"] = new Date().toISOString();
        if (data.email) data._replyto = data.email;
        if (btn) { btn.disabled = true; btn.innerHTML = "Sending…"; }
        msg.className = "form-msg";
        fetch(endpoint(), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === "false" || j.success === false) throw new Error(j.message || "fail"); return j; }); })
          .then(function () {
            msg.className = "form-msg ok"; msg.textContent = f.getAttribute("data-success") || "Thanks! We received it and will reply within 1 business day.";
            f.reset(); XL.track("generate_lead", { form: kind });
            var list = store.get("leads", []); list.push(kind); store.set("leads", list);
            f.dispatchEvent(new CustomEvent("xl:sent", { detail: data }));
          })
          .catch(function () {
            msg.className = "form-msg err";
            msg.innerHTML = "Couldn't send automatically. <a href='#' data-fallback>Click here to send it by email instead</a>.";
            msg.querySelector("[data-fallback]").addEventListener("click", function (ev) {
              ev.preventDefault();
              var body = Object.keys(data).filter(function (k) { return k[0] !== "_"; }).map(function (k) { return k + ": " + data[k]; }).join("\n");
              XL.openMail(data._subject, body);
            });
          })
          .finally(function () { if (btn) { btn.disabled = false; btn.innerHTML = label; } });
      });
    });
  }

  /* ---------- donations ---------- */
  function initDonate() {
    var box = document.querySelector("[data-donate]"); if (!box) return;
    var amt = 25, freq = "one-time";
    box.querySelectorAll(".amounts button").forEach(function (b) {
      b.addEventListener("click", function () {
        box.querySelectorAll(".amounts button").forEach(function (x) { x.classList.remove("on"); }); b.classList.add("on");
        amt = +b.dataset.amt; var ci = box.querySelector("[name=custom]"); if (ci) ci.value = "";
        upd();
      });
    });
    var ci = box.querySelector("[name=custom]"); if (ci) ci.addEventListener("input", function () { if (+ci.value > 0) { amt = +ci.value; box.querySelectorAll(".amounts button").forEach(function (x) { x.classList.remove("on"); }); upd(); } });
    box.querySelectorAll("[name=freq]").forEach(function (r) { r.addEventListener("change", function () { freq = r.value; upd(); }); });
    function upd() { box.querySelectorAll("[data-amt-label]").forEach(function (el) { el.textContent = "$" + amt + (freq === "monthly" ? "/mo" : ""); }); var h = document.querySelector("[name=pledge_amount]"); if (h) h.value = "$" + amt + " " + freq; }
    upd();
    document.querySelectorAll("[data-pay]").forEach(function (b) {
      var k = b.getAttribute("data-pay"), link = (C.donate || {})[k];
      b.addEventListener("click", function (e) {
        e.preventDefault(); XL.track("begin_checkout", { method: k, value: amt });
        if (link) window.open(link, "_blank", "noopener");
        else { var p = document.getElementById("pledge"); if (p) { p.scrollIntoView({ behavior: "smooth" }); XL.toast("Checkout link is being set up — leave a pledge and we'll send a secure payment link."); } }
      });
    });
  }
  function initFund() {
    var g = C.fundGoal; if (!g) return;
    document.querySelectorAll("[data-fund]").forEach(function (el) {
      var pct = Math.min(100, Math.round((g.raised / g.goal) * 100));
      el.innerHTML = '<div class="small muted">' + g.label + '</div><div class="progress"><i style="width:' + Math.max(pct, 2) + '%"></i></div><div class="small"><b>$' + g.raised.toLocaleString() + "</b> raised of $" + g.goal.toLocaleString() + " goal · " + pct + "%</div>";
    });
  }
})();
