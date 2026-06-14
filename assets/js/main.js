/* Chih Han Yang — site interactions
   Vanilla JS: mobile nav, scroll reveal, active-link highlight, footer year. */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");
  var links = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll("a")) : [];

  /* ---- Mobile nav toggle ---- */
  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close the menu after picking a destination.
    links.forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Border on nav once scrolled ---- */
  function onScroll() {
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Scroll reveal ---- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---- Active nav link based on current page ---- */
  var path = location.pathname.replace(/index\.html$/, "");
  if (path.charAt(path.length - 1) !== "/") path += "/";
  var best = null;
  links.forEach(function (a) {
    var href = new URL(a.href).pathname.replace(/index\.html$/, "");
    if (href.charAt(href.length - 1) !== "/") href += "/";
    // Home ("/") only matches exactly; others match when the path is under them.
    var match = href === "/" ? path === "/" : path.indexOf(href) === 0;
    if (match && (!best || href.length > best.href.length)) {
      best = { link: a, href: href };
    }
  });
  if (best) {
    best.link.classList.add("is-active");
    best.link.setAttribute("aria-current", "page");
  }

  /* ---- Footer year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
