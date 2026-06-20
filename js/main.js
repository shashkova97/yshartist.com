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

  /* ---- Видео в шапке: надёжный автозапуск ---- */
  var heroVid = document.querySelector(".hero__media");
  if (heroVid) {
    heroVid.muted = true;
    heroVid.playsInline = true;
    heroVid.setAttribute("muted", "");
    var tryPlay = function () {
      var p = heroVid.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    };
    tryPlay();
    heroVid.addEventListener("loadeddata", tryPlay, { once: true });
    heroVid.addEventListener("canplay", tryPlay, { once: true });
    // Подстраховка: если браузер заблокировал автозапуск — стартуем при первом действии
    var kick = function () {
      tryPlay();
      window.removeEventListener("touchstart", kick);
      window.removeEventListener("click", kick);
      window.removeEventListener("scroll", kick);
    };
    window.addEventListener("touchstart", kick, { once: true, passive: true });
    window.addEventListener("click", kick, { once: true });
    window.addEventListener("scroll", kick, { once: true, passive: true });
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
  } else if (glow) {
    /* Телефон: фонарик подсвечивает место касания / скролла */
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var ccx = tx, ccy = ty, hideTimer;
    function moveGlow(e) {
      var t = e.touches && e.touches[0];
      if (!t) return;
      tx = t.clientX; ty = t.clientY;
      glow.style.opacity = "1";
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { glow.style.opacity = "0"; }, 900);
    }
    window.addEventListener("touchstart", moveGlow, { passive: true });
    window.addEventListener("touchmove", moveGlow, { passive: true });
    (function tloop() {
      ccx += (tx - ccx) * 0.18;
      ccy += (ty - ccy) * 0.18;
      glow.style.transform = "translate(" + ccx + "px," + ccy + "px)";
      requestAnimationFrame(tloop);
    })();
  }

  /* ---- Параллакс: скролл + наклон(телефон)/мышь(компьютер) ---- */
  var pImg = document.querySelector(".hero__figure img, .hero__figure video");
  var pContent = document.querySelector(".hero__content");
  if (pImg && !reduceMotion) {
    var tX = 0, tY = 0, smX = 0, smY = 0; // цель и сглаженный наклон (-1..1)

    // Компьютер: движение мыши
    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", function (e) {
        tX = (e.clientX / window.innerWidth - 0.5) * 2;
        tY = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    // Телефон: гироскоп (наклон устройства)
    function enableGyro() {
      window.addEventListener("deviceorientation", function (e) {
        if (e.gamma == null) return;
        tX = Math.max(-1, Math.min(1, e.gamma / 12));
        tY = Math.max(-1, Math.min(1, (e.beta - 45) / 12));
      }, { passive: true });
    }
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      // iOS: запрос доступа к датчикам при первом касании
      window.addEventListener("touchend", function once() {
        DeviceOrientationEvent.requestPermission()
          .then(function (st) { if (st === "granted") enableGyro(); })
          .catch(function () {});
        window.removeEventListener("touchend", once);
      }, { once: true });
    } else if ("ondeviceorientation" in window) {
      enableGyro();
    }

    (function ploop() {
      smX += (tX - smX) * 0.06;
      smY += (tY - smY) * 0.06;
      var vh = window.innerHeight || 1;
      var sy = Math.min(window.scrollY, vh); // параллакс только в пределах шапки
      pImg.style.transform =
        "translate3d(" + (smX * -20) + "px," + (sy * 0.05 + smY * -16) + "px,0) scale(1.16)";
      if (pContent) {
        pContent.style.transform =
          "translate3d(" + (smX * 24) + "px," + (sy * -0.05 + smY * 18) + "px,0)";
      }
      requestAnimationFrame(ploop);
    })();
  }
})();
