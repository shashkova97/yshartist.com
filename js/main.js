/* ============================================================
   NAME — интерактив и анимации
   ============================================================ */
(function () {
  "use strict";

  /* ---- Год в подвале ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Навигация: фон при скролле ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Мобильное меню ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  function toggleMenu() {
    burger.classList.toggle("open");
    menu.classList.toggle("open");
    document.body.style.overflow = menu.classList.contains("open") ? "hidden" : "";
  }
  if (burger) burger.addEventListener("click", toggleMenu);
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      burger.classList.remove("open");
      menu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ---- Появление элементов при скролле ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Плавающие пылинки в свете свечей ---- */
  var dust = document.querySelector(".dust");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (dust && !reduceMotion) {
    var COUNT = window.innerWidth < 700 ? 14 : 26;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < COUNT; i++) {
      var s = document.createElement("span");
      var size = 1.5 + Math.random() * 3.5;          // 1.5–5px
      var dur = 20 + Math.random() * 22;             // 20–42s
      s.style.left = Math.random() * 100 + "vw";
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.animationDuration = dur + "s";
      s.style.animationDelay = -Math.random() * dur + "s";
      s.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
      s.style.setProperty("--o", (0.12 + Math.random() * 0.4).toFixed(2));
      frag.appendChild(s);
    }
    dust.appendChild(frag);
  }

  /* ---- Свечение за курсором (только для мыши) ---- */
  var glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    var gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", function (e) {
      gx = e.clientX; gy = e.clientY;
      glow.style.opacity = "1";
    });
    (function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(loop);
    })();
  }
})();
