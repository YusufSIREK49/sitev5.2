document.addEventListener("DOMContentLoaded", function () {
  const target = document.getElementById("footer-placeholder") || document.querySelector("footer.site-footer") || document.querySelector("footer");

  // Sayfanın kök dizine olan mesafesini belirleme (Alt klasörlerdeki dosyalar için güvenli yol)
  const isSubFolder = window.location.pathname.split("/").filter(Boolean).length > 1;
  const basePath = isSubFolder ? "/" : "";

  const footerHTML = `
  <div class="footer-container">
    
    <!-- 1. Sütun: Marka & Misyon -->
    <div class="footer-col footer-brand">
      <div class="f-logo">
        <img src="https://cdn1.site-media.eu/images/114/22934790/GeerkenLogo-Photoroom-82aMDiSMSNM52OeysD1XRQ-EgWrwxwoIVNv8WhyNw0qWA.png" alt="BTÜ Geçerken Logo">
        <h3>BTÜ Geçerken</h3>
      </div>
      <p class="f-desc">Bursa Teknik Üniversitesi bünyesinde ilmi, kültürel ve dijital üretimleri buluşturan öğrenci topluluğu.</p>
      <div class="f-motto">"Geçerken Güzel Bir İz Bırak"</div>
    </div>

    <!-- 2. Sütun: Hızlı Bağlantılar & Ekosistem -->
    <div class="footer-col">
      <h4 class="f-title">Ekosistem</h4>
      <ul class="f-links">
        <li><a href="${basePath}index.html">Ana Sayfa</a></li>
        <li><a href="${basePath}etkinlikler.html">Etkinlikler</a></li>
        <li><a href="${basePath}btugecerkenblog.html">BTÜ Geçerken Blog</a></li>
        <li><a href="${basePath}dergilik.html">BTÜ Geçerken Dergilik</a></li>
        <li><a href="${basePath}btugecerkentv.html" target="_blank">BTÜ Geçerken TV</a></li>
        <li><a href="https://farabiai.btugecerken.com" target="_blank">Farabi AI (Beta)</a></li>
        <li><a href="https://docs.btugecerken.com" target="_blank" class="docs-highlight-link"><i class="fa-solid fa-book-bookmark"></i> BTÜ Geçerken Docs</a></li>
      </ul>
    </div>

    <!-- 3. Sütun: İletişim & Katılım -->
    <div class="footer-col">
      <h4 class="f-title">Katılım & İletişim</h4>
      <p class="f-contact-info">
        <i class="fa-solid fa-location-dot"></i> 
        <a href="https://share.google/aTYJyCGNyI8jPvPSr" target="_blank" rel="noopener noreferrer">Mimar Sinan Yerleşkesi, Yıldırım / BURSA</a>
      </p>
      <p class="f-contact-info"><i class="fa-solid fa-envelope"></i> <a href="mailto:info@btugecerken.com">info@btugecerken.com</a></p>
      
      <div class="f-actions">
        <a href="https://bys3.btu.edu.tr/ogrenci/giris/42" target="_blank" class="f-btn-join">
          <i class="fa-solid fa-user-plus"></i> Topluluğa Katıl
        </a>
        <a href="https://www.instagram.com/btugecerkentoplulugu/" target="_blank" class="f-social-btn" aria-label="Instagram">
          <i class="fa-brands fa-instagram"></i>
        </a>
      </div>
    </div>

  </div>

  <!-- Alt Telif & Yasal Şerit -->
  <div class="footer-bottom">
    <div class="footer-bottom-inner">
      <span>© 2026 BTÜ Geçerken Topluluğu. Tüm Hakları Saklıdır.</span>
      <div class="f-legal-links">
        <a href="${basePath}yasal-uyari.html">Yasal Uyarı & Gizlilik</a>
        <a href="https://docs.btugecerken.com" target="_blank">Dokümantasyon</a>
        <a href="https://btugecerken.com">btugecerken.com</a>
      </div>
    </div>
  </div>
  `;

  if (target) {
    target.className = "site-footer";
    target.innerHTML = footerHTML;
  }
});