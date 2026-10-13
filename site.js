// Nauld Adjahuime, comportements du site
(function () {
  var EN = document.documentElement.lang === "en";
  var T = EN
    ? { close: "Close", big: "Work, full view", prev: "Previous work", next: "Next work", x: "Close ✕", ask: "Request this work", buy: "Buy online", note: "Secure card payment on Artmajeur, tracked delivery.", subj: "Acquiring a work" }
    : { close: "Fermer", big: "Œuvre en grand", prev: "Œuvre précédente", next: "Œuvre suivante", x: "Fermer ✕", ask: "Demander cette œuvre", buy: "Acheter en ligne", note: "Paiement sécurisé par carte sur Artmajeur, livraison suivie.", subj: "Acquisition d'une œuvre" };
  var header =document.querySelector(".site-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 30); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? T.close : "Menu";
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  // Apparition au défilement
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add("in"); }); }

  // Ouverture : fondu entre une image de chaque série
  var slides = document.querySelectorAll(".opening .slides img");
  if (slides.length) {
    var i = 0;
    slides[0].classList.add("on");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && slides.length > 1) {
      setInterval(function () {
        slides[i].classList.remove("on");
        i = (i + 1) % slides.length;
        slides[i].classList.add("on");
      }, 5200);
    }
  }

  // Visionneuse : image en grand + notice de l'œuvre
  var works = Array.prototype.slice.call(document.querySelectorAll(".work[data-title]"));
  if (works.length) {
    var v = document.createElement("div");
    v.className = "viewer";
    v.setAttribute("role", "dialog");
    v.setAttribute("aria-modal", "true");
    v.setAttribute("aria-label", T.big);
    v.innerHTML =
      '<span class="count"></span>' +
      '<button class="ctrl close" type="button">' + T.x + '</button>' +
      '<div class="stage"><button class="ctrl prev" type="button" aria-label="' + T.prev + '">‹</button><div class="pic"></div><button class="ctrl next" type="button" aria-label="' + T.next + '">›</button></div>' +
      '<aside><span class="num"></span><h3></h3><div class="specs"></div><div class="notice"></div><a class="btn solid ask" href="#">' + T.ask + '</a><a class="btn buy" href="#" target="_blank" rel="noopener">' + T.buy + '</a><p class="buy-note">' + T.note + '</p></aside>';
    document.body.appendChild(v);
    var pic = v.querySelector(".pic"), cur = 0, last = null;

    function show(n) {
      cur = (n + works.length) % works.length;
      var w = works[cur], d = w.dataset;
      var alt = d.title;
      if (d.large2) {
        pic.innerHTML = '<div class="pair"><img alt=""><img alt=""></div>';
        var im = pic.querySelectorAll("img");
        im[0].src = d.large; im[1].src = d.large2; im[0].alt = alt;
      } else {
        pic.innerHTML = '<img alt="">';
        pic.firstChild.src = d.large; pic.firstChild.alt = alt;
      }
      v.querySelector(".num").textContent = d.num || "";
      v.querySelector("h3").textContent = d.title;
      v.querySelector(".specs").textContent = d.specs || "";
      v.querySelector(".notice").innerHTML = d.notice ? "<p>" + d.notice + "</p>" : "";
      var ask = v.querySelector(".ask");
      ask.href = "contact.html?oeuvre=" + encodeURIComponent(d.ask || d.title);
      ask.textContent = d.cta || T.ask;
      var buy = v.querySelector(".buy"), note = v.querySelector(".buy-note");
      buy.style.display = note.style.display = d.buy ? "" : "none";
      if (d.buy) buy.href = d.buy;
      v.querySelector(".count").textContent = (cur + 1) + " / " + works.length;
    }
    function open(n) { last = document.activeElement; show(n); v.classList.add("open"); document.body.style.overflow = "hidden"; v.querySelector(".close").focus(); }
    function close() { v.classList.remove("open"); document.body.style.overflow = ""; if (last) last.focus(); }
    works.forEach(function (w, n) {
      var b = w.querySelector("button");
      if (b) b.addEventListener("click", function () { open(n); });
    });
    v.querySelector(".close").addEventListener("click", close);
    v.querySelector(".prev").addEventListener("click", function () { show(cur - 1); });
    v.querySelector(".next").addEventListener("click", function () { show(cur + 1); });
    document.addEventListener("keydown", function (e) {
      if (!v.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
    var x0 = null;
    v.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    v.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 60) show(cur + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  }

  // Formulaire : œuvre pré-remplie
  var form = document.querySelector("form[name=contact]");
  if (form) {
    var oeuvre = new URLSearchParams(window.location.search).get("oeuvre");
    if (oeuvre) {
      var sujet = form.querySelector("[name=sujet]");
      if (sujet) sujet.value = T.subj;
      form.querySelector("[name=oeuvre]").value = oeuvre;
      var msg = form.querySelector("[name=message]");
      if (!msg.value) msg.value = EN
        ? "Hello Nauld,\n\nI am interested in “" + oeuvre + "”. Could you tell me the available sizes, the edition and the price?\n\nThank you."
        : "Bonjour Nauld,\n\nJe m'intéresse à « " + oeuvre + " ». Pourriez-vous m'indiquer les formats disponibles, l'édition et le prix ?\n\nMerci.";
    }
  }
})();

// Visites : statistiques GoatCounter + alerte ntfy (une par visiteur et par jour)
// Pour ne pas recevoir d'alerte de ses propres visites : ouvrir une fois le site avec ?moi=1 (et ?moi=0 pour annuler)
(function () {
  var GC = "https://nauldadjahuime.goatcounter.com/count";
  var NTFY = "https://ntfy.sh/nauld-visites-vji7ne962n";
  if (navigator.webdriver || location.hostname.indexOf("nauldadjahuime.com") === -1) return;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  var q = new URLSearchParams(location.search).get("moi");
  if (q === "1") set("nauld-moi", "1");
  if (q === "0") set("nauld-moi", null);
  if (get("nauld-moi")) return;

  var ref = document.referrer && document.referrer.indexOf(location.host) === -1 ? document.referrer : "";
  new Image().src = GC + "?p=" + encodeURIComponent(location.pathname) + "&t=" + encodeURIComponent(document.title) +
    "&r=" + encodeURIComponent(ref) + "&s=" + screen.width + "&rnd=" + Math.random().toString(36).slice(2);

  var today = new Date().toISOString().slice(0, 10);
  if (get("nauld-vu") === today) return;
  set("nauld-vu", today);
  var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
  var page = document.title.split(" · ")[0];
  var from = ref ? ref.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] : "accès direct";
  var msg = "Page : " + page + (document.documentElement.lang === "en" ? " (version anglaise)" : "") +
    "\nZone : " + (tz.replace(/_/g, " ") || "inconnue") +
    "\nVenu de : " + from +
    "\nAppareil : " + (/Mobi|Android/i.test(navigator.userAgent) ? "téléphone" : "ordinateur");
  try {
    fetch(NTFY + "?title=" + encodeURIComponent("Nouvelle visite sur ton site") + "&tags=eyes",
      { method: "POST", body: msg, keepalive: true, mode: "no-cors" });
  } catch (e) {}
})();

// Protection des images : clic droit et glisser bloqués sur les photos
(function () {
  function isImg(t) { return t && (t.tagName === "IMG" || (t.closest && t.closest(".work, .viewer .pic, .chapter, .series-hero, .opening"))); }
  document.addEventListener("contextmenu", function (e) { if (isImg(e.target)) e.preventDefault(); });
  document.addEventListener("dragstart", function (e) { if (isImg(e.target)) e.preventDefault(); });
})();
