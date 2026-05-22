(function () {
  function onScroll() {
    const header = document.querySelector(".md-header");
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();


/* =========================================
   Drawer Home Link Injection v13
   Only adds "← Home" links in split-screen / drawer widths.
   Full-width desktop sidebars must not show these extra links.
   ========================================= */
(function () {
  var HALF_SCREEN_QUERY = "(max-width: 1220px)";

  function isHalfScreen() {
    return window.matchMedia(HALF_SCREEN_QUERY).matches;
  }

  function getBasePath() {
    var path = window.location.pathname || "/";
    var marker = "/pi-plus-from-scratch/";
    var idx = path.indexOf(marker);
    if (idx !== -1) return path.slice(0, idx + marker.length);
    return "/";
  }

  function removeDrawerHomeLinks() {
    document.querySelectorAll(".ht-drawer-home-link").forEach(function (node) {
      node.remove();
    });
  }

  function insertDrawerHomeLinks() {
    if (!isHalfScreen()) {
      removeDrawerHomeLinks();
      return;
    }

    var base = getBasePath();

    /*
      Only add Home links inside nested Material drawer nav levels.
      Top-level nav remains clean.
    */
    var drawerNavs = document.querySelectorAll(".md-sidebar--primary .md-nav--primary .md-nav");

    drawerNavs.forEach(function (nav) {
      if (!nav.closest(".md-nav__item")) return;
      if (nav.querySelector(":scope > .ht-drawer-home-link")) return;

      var title = nav.querySelector(":scope > .md-nav__title");
      var list = nav.querySelector(":scope > .md-nav__list");

      var home = document.createElement("a");
      home.className = "ht-drawer-home-link";
      home.href = base;
      home.innerHTML = '<span class="ht-drawer-home-arrow">←</span><span>Home</span>';

      if (title && title.nextSibling) {
        nav.insertBefore(home, title.nextSibling);
      } else if (list) {
        nav.insertBefore(home, list);
      } else {
        nav.insertBefore(home, nav.firstChild);
      }
    });
  }

  var resizeTimer = null;
  function scheduleUpdate() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(insertDrawerHomeLinks, 120);
  }

  document.addEventListener("DOMContentLoaded", insertDrawerHomeLinks);
  document.addEventListener("navigation", insertDrawerHomeLinks);
  window.addEventListener("resize", scheduleUpdate);

  setTimeout(insertDrawerHomeLinks, 250);
  setTimeout(insertDrawerHomeLinks, 900);
})();


/* =========================================
   Header logo external link v14
   The logo in normal MkDocs Material pages points to the English company site.
   ========================================= */
(function () {
  function setLogoLink() {
    document.querySelectorAll(".md-header .md-logo").forEach(function (logo) {
      logo.setAttribute("href", "https://www.hightorquerobotics.com/");
      logo.setAttribute("target", "_blank");
      logo.setAttribute("rel", "noopener noreferrer");
      logo.setAttribute("aria-label", "HighTorque Robotics");
    });
  }

  document.addEventListener("DOMContentLoaded", setLogoLink);
  document.addEventListener("navigation", setLogoLink);
  setTimeout(setLogoLink, 250);
})();
