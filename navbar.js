document.addEventListener("DOMContentLoaded", function () {
  const placeholder = document.getElementById("navbar-placeholder") || document.querySelector(".custom-navbar");
  
  // URL'den dosya adını ve temiz yolu al
  const currentPath = window.location.pathname.toLowerCase();
  const fileName = currentPath.split("/").pop() || "index.html";

  // Sayfa türünü akıllı tespit et
  const isHome = fileName === "" || fileName === "index.html" || currentPath.endsWith("/");
  const isEvents = currentPath.includes("etkinlik") || fileName.includes("etkinlik");
  const isBlog = currentPath.includes("blog") || fileName.includes("blog") || currentPath.includes("yazi");
  const isDergilik = currentPath.includes("dergilik");
  const isTeam = currentPath.includes("ekibimiz");

  const navbarHTML = `
  <div class="nav-inner">
    <a href="index.html" class="nav-logo-wrap">
      <img src="https://cdn1.site-media.eu/images/114/22934790/GeerkenLogo-Photoroom-82aMDiSMSNM52OeysD1XRQ-EgWrwxwoIVNv8WhyNw0qWA.png" alt="BTÜ Geçerken">
      <div class="nav-logo-text">
        <span class="nav-univ">Bursa Teknik Üniversitesi</span>
        <span class="nav-comm">Geçerken Topluluğu</span>
      </div>
    </a>

    <nav id="main-nav">
      <a href="index.html" class="nav-link ${isHome ? 'active' : ''}">Ana Sayfa</a>
      <a href="etkinlikler.html" class="nav-link ${isEvents ? 'active' : ''}">Etkinlikler</a>
      <a href="btugecerkenblog.html" class="nav-link ${isBlog ? 'active' : ''}">BTÜ Geçerken BLOG</a>
      <a href="dergilik.html" class="nav-link ${isDergilik ? 'active' : ''}">Dergilik</a>
      <a href="https://farabiai.btugecerken.com/" class="nav-link" target="_blank">Farabi AI <i>beta</i></a>
      <a href="ekibimiz.html" class="nav-link ${isTeam ? 'active' : ''}">Ekibimiz</a>
      <a href="https://lab.btugecerken.com" target="_blank" rel="noopener noreferrer" class="nav-btn-login">BTÜ GEÇERKEN LAB</a>
    </nav>

    <button id="mobile-menu-btn" aria-label="Menüyü aç/kapat">
      <span></span><span></span><span></span>
    </button>
  </div>
  `;

  if (placeholder) {
    placeholder.className = "custom-navbar";
    placeholder.innerHTML = navbarHTML;
  }

  // Hamburger menü etkileşimleri
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navMenu = document.getElementById("main-nav");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      menuBtn.classList.toggle("open");
      navMenu.classList.toggle("open");
    });

    document.addEventListener("click", function (e) {
      if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
        menuBtn.classList.remove("open");
        navMenu.classList.remove("open");
      }
    });
  }
});