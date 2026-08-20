/* ============================================================
   GAP3 - custom.js   (site behaviour; no animation library)
   If this file fails, the site stays fully usable.
   ============================================================ */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.classList.remove("no-js"); root.classList.add("js");

  function ready(fn) {
    if (doc.readyState !== "loading") fn();
    else doc.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    doc.querySelectorAll(".sol-media").forEach(function (m) {
      var b = m.querySelector(".follow-badge"); if (!b) return;
      m.addEventListener("mousemove", function (e) {
        var r = m.getBoundingClientRect();
        b.style.left = (e.clientX - r.left) + "px";
        b.style.top = (e.clientY - r.top) + "px";
      });
    });

    doc.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

    var header = doc.querySelector(".site-header");
    if (header) {
      var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
      onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    }

    var burger = doc.querySelector(".burger");
    var drawer = doc.querySelector(".mobile-nav");
    var backdrop = doc.querySelector(".nav-backdrop");
    var main = doc.querySelector("main");
    var footer = doc.querySelector(".site-footer");

    function inert(on) {
      [main, footer].forEach(function (el) { if (el) { on ? el.setAttribute("inert", "") : el.removeAttribute("inert"); } });
    }
    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add("is-open"); if (backdrop) backdrop.classList.add("is-open");
      if (burger) burger.setAttribute("aria-expanded", "true");
      drawer.setAttribute("aria-hidden", "false");
      doc.body.style.overflow = "hidden"; inert(true);
      var first = drawer.querySelector("a, button"); if (first) first.focus();
    }
    function closeDrawer(returnFocus) {
      if (!drawer) return;
      drawer.classList.remove("is-open"); if (backdrop) backdrop.classList.remove("is-open");
      if (burger) burger.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");
      doc.body.style.overflow = ""; inert(false);
      if (returnFocus && burger) burger.focus();
    }
    if (burger) burger.addEventListener("click", function () {
      burger.getAttribute("aria-expanded") === "true" ? closeDrawer(true) : openDrawer();
    });
    if (backdrop) backdrop.addEventListener("click", function () { closeDrawer(true); });
    var mClose = doc.querySelector(".mobile-nav .m-close");
    if (mClose) mClose.addEventListener("click", function () { closeDrawer(true); });
    if (drawer) drawer.addEventListener("click", function (e) { if (e.target.closest("a")) closeDrawer(false); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) closeDrawer(true);
    });
    var mqDesktop = window.matchMedia("(min-width: 1025px)");
    (mqDesktop.addEventListener ? mqDesktop.addEventListener.bind(mqDesktop, "change") : mqDesktop.addListener.bind(mqDesktop))(function () {
      if (mqDesktop.matches) closeDrawer(false);
    });

    doc.querySelectorAll(".main-nav .has-children > a").forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (window.matchMedia("(hover: none)").matches) {
          var parent = link.closest(".has-children");
          if (parent && !parent.classList.contains("is-open")) { e.preventDefault(); parent.classList.add("is-open"); }
        }
      });
    });
    doc.addEventListener("click", function (e) {
      if (!e.target.closest(".has-children")) doc.querySelectorAll(".has-children.is-open").forEach(function (p) { p.classList.remove("is-open"); });
    });

    var revealEls = doc.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
      }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    }

    var counters = doc.querySelectorAll("[data-count]");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (counters.length && "IntersectionObserver" in window && !reduce) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var el = en.target, target = parseFloat(el.getAttribute("data-count")), t0 = null, dur = 1600;
          var tick = function (ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            el.textContent = Math.round(target * (0.5 - Math.cos(Math.PI * p) / 2));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick); cio.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
    }

    if (window.matchMedia("(hover: hover)").matches && !reduce) {
      doc.querySelectorAll("[data-magnetic]").forEach(function (btn) {
        btn.addEventListener("mousemove", function (e) {
          var r = btn.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.18;
          var y = (e.clientY - r.top - r.height / 2) * 0.28;
          btn.style.transform = "translate(" + x + "px," + y + "px)";
        });
        btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
      });
    }

    doc.querySelectorAll(".faq .item").forEach(function (item) {
      var q = item.querySelector(".q"), a = item.querySelector(".a");
      if (!q || !a) return;
      q.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
      if (item.classList.contains("is-open")) a.style.maxHeight = a.scrollHeight + "px";
      q.addEventListener("click", function () {
        var open = item.classList.toggle("is-open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
        a.style.maxHeight = open ? a.scrollHeight + "px" : "";
      });
    });
    window.addEventListener("resize", function () {
      doc.querySelectorAll(".faq .item.is-open .a").forEach(function (a) { a.style.maxHeight = a.scrollHeight + "px"; });
    });

    doc.querySelectorAll("[data-chipgroup]").forEach(function (group) {
      var single = group.hasAttribute("data-single");
      group.querySelectorAll(".chip").forEach(function (chip) {
        chip.addEventListener("click", function () {
          if (single) {
            var wasOn = chip.classList.contains("is-on");
            group.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-on"); });
            if (!wasOn) chip.classList.add("is-on");
          } else {
            chip.classList.toggle("is-on");
          }
        });
      });
    });

    // WP admin mock — sidebar switches the visible panel
    doc.querySelectorAll(".wp-mock").forEach(function (mock) {
      var tabs = mock.querySelectorAll("[data-wpm]");
      var panels = mock.querySelectorAll(".wpm-panel");
      function activate(name) {
        tabs.forEach(function (t) {
          var on = t.getAttribute("data-wpm") === name;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-pressed", on ? "true" : "false");
        });
        panels.forEach(function (pn) { pn.classList.toggle("is-active", pn.getAttribute("data-panel") === name); });
      }
      tabs.forEach(function (t) {
        t.addEventListener("click", function () { activate(t.getAttribute("data-wpm")); });
      });
      // Open on the panel this page declares (svc_hero "mock_panel" field)
      var wrap = mock.closest("[data-mock-panel]");
      if (wrap) {
        var start = wrap.getAttribute("data-mock-panel");
        if (start && mock.querySelector('[data-wpm="' + start + '"]')) activate(start);
      }
    });

    // mobile nav: Services accordion
    doc.querySelectorAll(".mobile-nav .m-sub-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parent = btn.closest(".m-item-sub");
        if (!parent) return;
        var open = parent.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    var toTop = doc.querySelector(".back-to-top");
    if (toTop) {
      var tt = function () { toTop.classList.toggle("is-visible", window.scrollY > 600); };
      tt(); window.addEventListener("scroll", tt, { passive: true });
      toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
    }
  });
})();


/* Marquee tracks ship ONE group in the HTML (avoids duplicated keyword strings in the source).
   Clone it here so the CSS -50% loop stays seamless. */
(function () {
  function gap3CloneMarquees() {
    document.querySelectorAll("[data-marquee-clone]").forEach(function (track) {
      if (track.children.length === 1) track.appendChild(track.children[0].cloneNode(true));
    });
  }
  if (document.readyState !== "loading") gap3CloneMarquees();
  else document.addEventListener("DOMContentLoaded", gap3CloneMarquees);
})();
