document.addEventListener("DOMContentLoaded", function () {

  // 1. VIDEOLARI DINAMIK OLARAK GRID'E BASMA
  const videoGrid = document.getElementById("videoGrid");

  function renderVideos(list) {
    if (!videoGrid || !Array.isArray(list)) return;
    
    videoGrid.innerHTML = "";

    list.forEach(video => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.setAttribute("data-category", video.category);
      
      const thumbSrc = (video.thumbnail && video.thumbnail.trim() !== "") 
        ? video.thumbnail 
        : `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`;
      
      card.innerHTML = `
        <div class="video-card-thumb">
          <img src="${thumbSrc}" alt="${video.title}" loading="lazy" onerror="this.src='https://img.youtube.com/vi/${video.id}/hqdefault.jpg'">
          <div class="play-indicator"><i class="fa-solid fa-play"></i></div>
          <span class="video-tag">${video.categoryLabel || video.category}</span>
        </div>
        <div class="post-body">
          <h3 class="goal-title">${video.title}</h3>
          <p class="goal-desc">${video.desc}</p>
        </div>
      `;

      card.addEventListener("click", () => {
        playVideo(video.id, video.title);
      });

      videoGrid.appendChild(card);
    });
  }

  // Ilk yuklemede videolari listele
  if (typeof videoList !== "undefined" && videoList.length > 0) {
    renderVideos(videoList);

    const firstVideo = videoList[0];
    const player = document.getElementById("mainPlayer");
    const titleElem = document.getElementById("current-video-title");

    if (player) {
      player.src = "https://www.youtube-nocookie.com/embed/" + firstVideo.id + "?rel=0";
    }
    if (titleElem) {
      titleElem.innerHTML = "<em>" + firstVideo.title + "</em>";
    }
  }

  // 2. KATEGORI FILTRELEME VE ARAMA
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("videoSearch");

  function applyFilters() {
    if (typeof videoList === "undefined") return;

    const activeBtn = document.querySelector(".filter-btn.active");
    const activeCategory = activeBtn ? activeBtn.getAttribute("data-category") : "all";
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const filtered = videoList.filter(video => {
      const matchesCategory = (activeCategory === "all" || video.category === activeCategory);
      const matchesSearch = video.title.toLowerCase().includes(query) || video.desc.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    renderVideos(filtered);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      filterButtons.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  // 3. SCROLL REVEAL OBSERVER
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -20px 0px"
    });

    revealElements.forEach(element => revealObserver.observe(element));
  }

});

// 4. GLOBAL VIDEO OYNATICI FONKSIYONU
function playVideo(videoId, title) {
  const player = document.getElementById("mainPlayer");
  const titleElem = document.getElementById("current-video-title");

  if (player) {
    player.src = "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
  }

  if (titleElem && title) {
    titleElem.innerHTML = "<em>" + title + "</em>";
  }

  const playerSection = document.getElementById("player-section");
  if (playerSection) {
    playerSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

// ==========================================================================
// BTÜ GEÇERKEN - BLOG & ETKİNLİK DETAY POPUP AI ASİSTANI
// ==========================================================================
(function() {
  function initPopupEmbedAI() {
    const rawPath = window.location.pathname.toLowerCase();
    const fileName = rawPath.substring(rawPath.lastIndexOf('/') + 1);

    const isExcluded = rawPath === "" || 
                       rawPath === "/" || 
                       fileName === "" || 
                       fileName === "index.html" || 
                       fileName === "btugecerkenblog.html" || 
                       fileName === "etkinlikler.html" || 
                       fileName === "btugecerkenai.html" || 
                       fileName === "dergilik.html" || 
                       fileName === "pdf-viewer.html" || 
                       fileName === "ekibimiz.html" ||
                       document.querySelector(".hero") !== null ||
                       document.getElementById("aiWidgetToggle") !== null;

    if (isExcluded) return;
    if (document.getElementById("btu-ai-popup-wrap")) return;

    if (!document.getElementById("embed-ai-popup-css")) {
      const styleEl = document.createElement("style");
      styleEl.id = "embed-ai-popup-css";
      styleEl.textContent = `
        .btu-page-ai-trigger-bar {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 9998;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          padding: 6px 10px;
          border-radius: 50px;
          border: 1.5px solid rgba(0, 155, 119, 0.3);
          box-shadow: 0 8px 30px rgba(0, 35, 102, 0.15);
        }
        .btu-trigger-btn {
          border: none;
          outline: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 12.5px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 50px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .btn-trigger-sum {
          background: linear-gradient(135deg, #009B77, #002366);
          color: #ffffff;
        }
        .btn-trigger-chat {
          background: rgba(0, 155, 119, 0.08);
          color: #002366;
          border: 1px solid rgba(0, 155, 119, 0.2);
        }
        .btu-page-ai-popup {
          position: fixed;
          bottom: 84px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 32px);
          height: 520px;
          max-height: calc(100vh - 110px);
          background: #ffffff;
          border-radius: 20px;
          border: 1.5px solid rgba(0, 155, 119, 0.3);
          box-shadow: 0 20px 45px rgba(0, 35, 102, 0.22);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9999;
          opacity: 0;
          transform: translateY(20px) scale(0.96);
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.2);
          font-family: 'Noto Serif TR', serif;
        }
        .btu-page-ai-popup.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .popup-ai-header {
          background: linear-gradient(135deg, #009B77, #002366);
          color: #ffffff;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .popup-ai-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #faf8f5;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .pop-msg {
          max-width: 86%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.5;
          white-space: pre-line;
        }
        .pop-bot {
          align-self: flex-start;
          background: #ffffff;
          color: #111a16;
          border: 1px solid rgba(0, 155, 119, 0.18);
          border-left: 3.5px solid #009B77;
        }
        .pop-user {
          align-self: flex-end;
          background: #009B77;
          color: #ffffff;
        }
        .popup-ai-footer {
          padding: 10px 14px;
          background: #ffffff;
          border-top: 1px solid rgba(0, 155, 119, 0.15);
          display: flex;
          gap: 8px;
        }
        .popup-ai-footer input {
          flex: 1;
          border: 1px solid rgba(0, 155, 119, 0.25);
          border-radius: 25px;
          padding: 8px 14px;
          font-size: 13.5px;
          outline: none;
        }
        .popup-ai-footer button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #009B77;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }
      `;
      document.head.appendChild(styleEl);
    }

    const wrapEl = document.createElement("div");
    wrapEl.id = "btu-ai-popup-wrap";
    wrapEl.innerHTML = `
      <div class="btu-page-ai-trigger-bar">
        <button type="button" class="btu-trigger-btn btn-trigger-sum" id="btnPageSumTrigger">
          <i class="fa-solid fa-bolt"></i> Sayfayı Özetle
        </button>
        <button type="button" class="btu-trigger-btn btn-trigger-chat" id="btnPageChatTrigger">
          <i class="fa-solid fa-comment-dots"></i> Soru Sor
        </button>
      </div>
      <div class="btu-page-ai-popup" id="btuPageAiPopup">
        <div class="popup-ai-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="https://cdn1.site-media.eu/images/114/22934790/GeerkenLogo-Photoroom-82aMDiSMSNM52OeysD1XRQ-EgWrwxwoIVNv8WhyNw0qWA.png" style="width:30px;height:30px;border-radius:50%;background:#fff;padding:2px;">
            <div>
              <h4 style="margin:0;font-size:14px;color:#fff;">BTÜ Geçerken AI</h4>
              <span style="font-size:11px;color:#40E0D0;">Sayfa İçerik Asistanı</span>
            </div>
          </div>
          <button type="button" id="btnClosePagePopup" style="background:none;border:none;color:#fff;font-size:16px;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="popup-ai-messages" id="popAiMessages">
          <div class="pop-msg pop-bot">Merhaba! Bu sayfa içeriği hakkında sorularınızı yanıtlayabilir veya detayları sizin için özetleyebilirim.</div>
        </div>
        <form class="popup-ai-footer" id="popAiForm">
          <input type="text" id="popAiInput" placeholder="Bu içerik hakkında soru sor..." autocomplete="off">
          <button type="submit"><i class="fa-solid fa-paper-plane"></i></button>
        </form>
      </div>
    `;
    document.body.appendChild(wrapEl);

    const popup = document.getElementById("btuPageAiPopup");
    const btnSum = document.getElementById("btnPageSumTrigger");
    const btnChat = document.getElementById("btnPageChatTrigger");
    const btnClose = document.getElementById("btnClosePagePopup");
    const messagesBox = document.getElementById("popAiMessages");
    const form = document.getElementById("popAiForm");
    const input = document.getElementById("popAiInput");

    const DIFY_API_URL = "/api/dify/chat-messages";
    let conversationId = null;
    let isSummarizedOnce = false;

    const sessionUserId = "web_guest_" + (sessionStorage.getItem("btu_ai_uid") || (() => {
      const uid = Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem("btu_ai_uid", uid);
      return uid;
    })());

    btnChat.addEventListener("click", () => { popup.classList.add("open"); input.focus(); });
    btnClose.addEventListener("click", () => { popup.classList.remove("open"); });

    function appendMsg(text, sender) {
      const div = document.createElement("div");
      div.className = `pop-msg ${sender === "user" ? "pop-user" : "pop-bot"}`;
      div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      messagesBox.appendChild(div);
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return div;
    }

    async function askPageAI(userQuery, isInitial = false) {
      const pageTitle = document.title || "";
      const contentElem = document.querySelector(".post-article") || 
                          document.querySelector(".event-main-content") || 
                          document.querySelector("article") || 
                          document.body;
      const pageText = contentElem.innerText.replace(/\s+/g, " ").slice(0, 3800);

      let promptPayload = userQuery;
      if (isInitial || !conversationId) {
        promptPayload = `[SAYFA BAĞLAMI]:\nBaşlık: ${pageTitle}\nİçerik: ${pageText}\n\n[KULLANICI SORUSU]:\n${userQuery}`;
      }

      const payload = {
        inputs: {},
        query: promptPayload,
        response_mode: "blocking",
        user: sessionUserId
      };

      if (conversationId) payload.conversation_id = conversationId;

      const res = await fetch(DIFY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const rawText = await res.text();

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        throw new Error(`Sunucu HTML sayfası döndü (HTTP ${res.status}). Proxy adresi bulunamadı.`);
      }

      if (!res.ok) {
        if (data.message && data.message.includes("Conversation Not Exists") && conversationId) {
          conversationId = null;
          return askPageAI(userQuery, false);
        }
        throw new Error(data.message || `Sunucu Hatası (${res.status})`);
      }

      if (data.conversation_id) conversationId = data.conversation_id;

      const outputText = data.answer || 
                         (data.data && data.data.outputs && (data.data.outputs.answer || data.data.outputs.text || data.data.outputs.result)) || 
                         "";

      return outputText || "Cevap üretilemedi.";
    }

    btnSum.addEventListener("click", async () => {
      popup.classList.add("open");
      if (isSummarizedOnce) return;

      appendMsg("Bu sayfadaki içeriği benim için özetler misin?", "user");
      const loading = appendMsg("Sayfa inceleniyor, özet hazırlanıyor...", "bot");

      try {
        const answer = await askPageAI("Lütfen bu sayfadaki içeriği 3-4 maddede; ana fikri ve önemli noktaları belirterek akıcı bir dille özetle.", true);
        loading.remove();
        appendMsg(answer, "bot");
        isSummarizedOnce = true;
      } catch (err) {
        loading.remove();
        appendMsg(`⚠️ ${err.message}`, "bot");
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;

      appendMsg(val, "user");
      input.value = "";
      const loading = appendMsg("İnceleniyor...", "bot");

      try {
        const answer = await askPageAI(val);
        loading.remove();
        appendMsg(answer, "bot");
      } catch (err) {
        loading.remove();
        appendMsg(`⚠️ ${err.message}`, "bot");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPopupEmbedAI);
  } else {
    initPopupEmbedAI();
  }
})();

// ==========================================================================
// MERKEZİ DİNAMİK FOOTER MOTORU
// ==========================================================================
(function() {
  function initDynamicFooter() {
    const target = document.getElementById("footer-placeholder") || 
                   document.querySelector("footer.site-footer") || 
                   document.querySelector("footer");

    if (!target) return;

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
          <li><a href="https://farabiai.btugecerken.com" target="_blank">Farabi AI (Beta)</a></li>
          <li><a href="https://lab.btugecerken.com" target="_blank" style="color: #40E0D0 !important; font-weight: 700;"><i class="fa-solid fa-flask-vial"></i> BTÜ Geçerken Lab (Beta)</a></li>
          <li><a href="https://docs.btugecerken.com" target="_blank" style="color: #40E0D0 !important; font-weight: 700;"><i class="fa-solid fa-book-bookmark"></i> BTÜ Geçerken Docs</a></li>
        </ul>
      </div>

      <!-- 3. Sütun: İletişim & Katılım -->
      <div class="footer-col">
        <h4 class="f-title">Katılım & İletişim</h4>
        <p class="f-contact-info">
          <i class="fa-solid fa-location-dot"></i> 
          <a href="https://maps.app.goo.gl/brMAHJkT1Y29fDMB6" target="_blank" rel="noopener noreferrer">Mimar Sinan Yerleşkesi, Yıldırım / BURSA</a>
        </p>
        <p class="f-contact-info"><i class="fa-solid fa-envelope"></i> <a href="mailto:info@btugecerken.com">info@btugecerken.com</a></p>
        
        <div class="f-actions">
          <a href="https://bys.btu.edu.tr/" target="_blank" class="f-btn-join">
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

    target.className = "site-footer";
    target.innerHTML = footerHTML;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDynamicFooter);
  } else {
    initDynamicFooter();
  }
})();