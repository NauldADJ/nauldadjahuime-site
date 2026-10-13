/* Contenu ajouté depuis l'administration (/admin) */
(function () {
  function get(url) {
    try { var x = new XMLHttpRequest(); x.open("GET", url + "?v=" + Date.now(), false); x.send(); if (x.status === 200) return JSON.parse(x.responseText); } catch (e) {}
    return null;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var en = document.documentElement.lang === "en";
  var base = en ? "../" : "";

  var spot = document.getElementById("cms-nouveautes");
  if (spot) {
    var d = get(base + "data/nouvelles-oeuvres.json");
    var list = d && d.oeuvres ? d.oeuvres : [];
    if (list.length) {
      var h = '<div class="wrap"><div class="part-head reveal"><h2>' + (en ? "New works" : "Nouvelles œuvres") + '</h2></div><div class="grid-coll">';
      list.forEach(function (o) {
        var img = base + String(o.image || "").replace(/^\//, "");
        var prix = o.prix ? esc(o.prix) : (en ? "Price on request" : "Prix sur demande");
        var specs = (o.annee ? esc(o.annee) + " · " : "") + prix;
        var notice = esc(o.texte || (en ? "Fine Art pigment print, signed, limited edition, with certificate of authenticity." : "Tirage Fine Art pigmentaire, signé, édition limitée, avec certificat d'authenticité."));
        var ask = esc(o.titre + (o.annee ? " (" + o.annee + ")" : ""));
        h += '<figure class="work reveal" data-num="' + esc(o.categorie || "") + '" data-title="' + esc(o.titre) + '" data-specs="' + specs + '" data-notice="' + notice + '" data-ask="' + ask + '"' +
          (o.artmajeur ? ' data-buy="' + esc(o.artmajeur) + '"' : "") +
          ' data-cta="' + (o.disponible === false ? (en ? "Ask about this work" : "Se renseigner sur cette œuvre") : (en ? "Acquire this work" : "Acquérir cette œuvre")) + '" data-large="' + esc(img) + '">' +
          '<button type="button" aria-label="' + esc(o.titre) + '"><img src="' + esc(img) + '" alt="' + esc(o.titre) + ', Nauld Adjahuime" loading="lazy"></button>' +
          '<figcaption><span class="num">' + esc(o.categorie || "") + '</span><span class="title">' + esc(o.titre) + '</span><span class="specs">' + (o.annee ? esc(o.annee) + " · " : "") + '<span class="price">' + (o.disponible === false ? (en ? "Sold" : "Vendu") : prix) + '</span></span></figcaption></figure>';
      });
      spot.innerHTML = h + "</div></div>";
      spot.hidden = false;
    }
  }

  var news = document.querySelector(".news-list");
  if (news) {
    var a = get(base + "data/actualites.json");
    var items = a && a.actualites ? a.actualites : [];
    var html = "";
    items.forEach(function (n) {
      var img = n.image ? '<img src="' + esc(base + String(n.image).replace(/^\//, "")) + '" alt="" loading="lazy">' : "";
      var lien = n.lien ? ' <a class="arrow" href="' + esc(n.lien) + '" target="_blank" rel="noopener">' + (en ? "More" : "En savoir plus") + '</a>' : "";
      html += '<li class="news-item reveal"><div class="date">' + esc(n.date) + (n.type ? '<br><span class="muted" style="letter-spacing:.14em">' + esc(n.type) + '</span>' : "") +
        '</div><div><h3>' + esc(n.titre) + '</h3><p>' + esc(n.texte || "") + lien + '</p></div><div>' + img + '</div></li>';
    });
    if (html) news.insertAdjacentHTML("afterbegin", html);
  }

  if (/(invite|recovery|confirmation)_token=/.test(location.hash) && !/\/admin\//.test(location.pathname)) {
    location.href = "/admin/" + location.hash;
  }
})();
