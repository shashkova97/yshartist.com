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
