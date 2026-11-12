document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("sidebarMenu");
  const sidebar = document.getElementById("docsSidebar");
  const search = document.getElementById("docSearchInput");
  const toggle = document.getElementById("sidebarToggle");
  const current = document.body.dataset.page || "";

  // 1. Sol menü (docs-nav.js fihristinden)
  function renderSidebar(list) {
    menu.innerHTML = "";
    if (!list.length) {
      menu.innerHTML = '<div class="search-empty">Sonuç bulunamadı.</div>';
      return;
    }
    list.forEach(cat => {
      const block = document.createElement("div");
      block.className = "sidebar-category";
      block.innerHTML = `<div class="sidebar-cat-title"></div>`;
      block.firstChild.textContent = cat.category;
      cat.topics.forEach(t => {
        const a = document.createElement("a");
        a.className = "sidebar-link";
        a.href = `${cat.file}#${t.id}`;
        a.dataset.id = t.id;
        a.dataset.file = cat.file;
        a.textContent = t.title;
        a.addEventListener("click", () => {
          if (window.innerWidth <= 900) sidebar.classList.remove("open");
        });
        block.appendChild(a);
      });
      menu.appendChild(block);
    });
    setActive(location.hash.slice(1));
  }

  function setActive(id) {
    menu.querySelectorAll(".sidebar-link").forEach(l => {
      l.classList.toggle("active", !!id && l.dataset.id === id && l.dataset.file === current);
    });
  }

  // 2. Kaydırırken aktif konuyu vurgula
  const sections = document.querySelectorAll(".topic-section");
  if (sections.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-80px 0px -65% 0px" });
    sections.forEach(s => io.observe(s));
  }

  // 3. Kod bloklarına kopyala butonu
  document.querySelectorAll("#docContent pre").forEach(pre => {
    const box = document.createElement("div");
    box.className = "code-container";
    pre.parentNode.insertBefore(box, pre);
    box.appendChild(pre);
    const btn = document.createElement("button");
    btn.className = "btn-copy-code";
    btn.innerHTML = '<i class="fa-regular fa-copy"></i> Kopyala';
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Kopyalandı!';
        setTimeout(() => { btn.innerHTML = '<i class="fa-regular fa-copy"></i> Kopyala'; }, 2000);
      });
    });
    box.appendChild(btn);
  });

  // 4. Arama (tüm sayfalardaki konu başlık ve açıklamaları)
  search?.addEventListener("input", e => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) return renderSidebar(docsNav);
    const res = docsNav.map(c => ({
      ...c,
      topics: c.topics.filter(t => t.title.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
    })).filter(c => c.topics.length);
    renderSidebar(res);
  });

  window.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); search?.focus(); }
  });
  toggle?.addEventListener("click", () => sidebar.classList.toggle("open"));
  window.addEventListener("hashchange", () => setActive(location.hash.slice(1)));

  renderSidebar(docsNav);
});