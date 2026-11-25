(function () {
  const STORAGE_KEY = "lsbd_lang";
  let currentLang = localStorage.getItem(STORAGE_KEY) || "id";
  let selectedPart = "all";

  const uiText = {
    id: {
      pageTitle: "Little Steps Big Dreams",
      brandTitle: "Little Steps Big Dreams",
      brandTagline: "Cerita hangat, toleransi, dan langkah belajar bermakna untuk masa depan besar.",
      allParts: "Semua Bagian",
      readMore: "Baca Selengkapnya",
      aboutBlogTitle: "Tentang Little Steps Big Dreams",
      aboutBlogDesc: "Ruang berbagi cerita, refleksi, dan ide belajar sehari-hari tentang pendidikan karakter, toleransi, metode belajar yang menyenangkan, P5, serta pendekatan Montessori dan teknologi—tersedia dalam bahasa Indonesia, Inggris, dan Mandarin.",
      aboutAuthorTitle: "Tentang Penulis",
      aboutAuthorDesc: "<strong>Elok Wahyu Firmani</strong> — Kota REOG. Menulis dengan ketertarikan pada proses belajar yang bertahap, hangat, dan bermakna bagi anak maupun pendamping belajar.",
      aboutContactTitle: "Kontak & Tautan",
      linkedinLabel: "LinkedIn:",
      footerText: "Little Steps Big Dreams • Elok Wahyu Firmani — Kota REOG",
      footerAboutLink: "Halaman Tentang",
      emptyArticles: "Belum ada artikel pada bagian ini."
    },
    en: {
      pageTitle: "Little Steps Big Dreams",
      brandTitle: "Little Steps Big Dreams",
      brandTagline: "Warm stories, tolerance, and meaningful learning steps for big dreams.",
      allParts: "All Parts",
      readMore: "Read More",
      aboutBlogTitle: "About Little Steps Big Dreams",
      aboutBlogDesc: "A space for sharing stories, reflections, and everyday learning ideas on character education, tolerance, fun learning, P5 projects, as well as Montessori and technology approaches—available in Indonesian, English, and Mandarin.",
      aboutAuthorTitle: "About the Author",
      aboutAuthorDesc: "<strong>Elok Wahyu Firmani</strong> — Kota REOG. Writing with an interest in gradual, warm, and meaningful learning processes for children and learning companions.",
      aboutContactTitle: "Contact & Links",
      linkedinLabel: "LinkedIn:",
      footerText: "Little Steps Big Dreams • Elok Wahyu Firmani — Kota REOG",
      footerAboutLink: "About Page",
      emptyArticles: "No articles available in this section yet."
    },
    zh: {
      pageTitle: "Little Steps Big Dreams",
      brandTitle: "Little Steps Big Dreams",
      brandTagline: "用温暖的故事、包容精神与有意义的学习步伐，迈向远大梦想。",
      allParts: "全部篇章",
      readMore: "阅读全文",
      aboutBlogTitle: "关于 Little Steps Big Dreams",
      aboutBlogDesc: "这是一个分享品格教育、包容精神、趣味学习、P5项目以及蒙特梭利与科技学习方法的日常故事、反思与灵感空间——提供印尼语、英语和中文版本。",
      aboutAuthorTitle: "关于作者",
      aboutAuthorDesc: "<strong>Elok Wahyu Firmani</strong> —— 雷奥格之城（Kota REOG）。关注循序渐进、温暖且有意义的学习过程，陪伴孩子与学习引路人共同成长。",
      aboutContactTitle: "联系方式与链接",
      linkedinLabel: "领英（LinkedIn）：",
      footerText: "Little Steps Big Dreams • Elok Wahyu Firmani — 雷奥格之城（Kota REOG）",
      footerAboutLink: "关于页面",
      emptyArticles: "该分类下暂无文章。"
    }
  };

  function toSafeText(value, lang) {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (typeof value === "object") {
      const picked = value[lang] || value.id || value.en || value.zh;
      if (typeof picked === "string" || typeof picked === "number") return String(picked);
      return "";
    }
    return "";
  }

  function getArticlesList() {
    if (Array.isArray(window.articlesData)) return window.articlesData;
    if (typeof articlesData !== "undefined" && Array.isArray(articlesData)) return articlesData;
    if (Array.isArray(window.articles)) return window.articles;
    if (typeof articles !== "undefined" && Array.isArray(articles)) return articles;
    return [];
  }

  function getLangBlock(article, lang) {
    if (!article || typeof article !== "object") return {};
    return article[lang] || article.id || article.en || article.zh || {};
  }

  function getPartKey(article, idx) {
    if (article && article.id) return String(article.id);
    return `part-${idx + 1}`;
  }

  function formatPartLabel(article, lang, idx) {
    const customPart = toSafeText(article && article.part, lang).trim();
    if (customPart) return customPart;

    const rawId = getPartKey(article, idx);
    const match = rawId.match(/part[-_\s]*(\d+)/i);
    const num = match ? match[1] : String(idx + 1);

    if (lang === "en") return `Part ${num}`;
    if (lang === "zh") return `第 ${num} 部分`;
    return `Bagian ${num}`;
  }

  function normalizeImageSrc(src) {
    if (!src || typeof src !== "string") return "";
    const clean = src.trim().replace(/^\/+/, "");
    if (clean.startsWith("images/")) return clean;
    return `images/${clean}`;
  }

  function attachSmartImage(imgEl, rawSrc, altText) {
    const primarySrc = normalizeImageSrc(rawSrc);
    if (!primarySrc) return;

    const fallbacks = [];
    if (primarySrc.endsWith(".jpg")) {
      fallbacks.push(primarySrc.replace(/\.jpg$/i, ".jpeg"));
      fallbacks.push(primarySrc.replace(/\.jpg$/i, ".png"));
      fallbacks.push(primarySrc.replace(/\.jpg$/i, ".JPG"));
    }

    let attemptIndex = 0;
    imgEl.alt = altText;
    imgEl.src = primarySrc;

    imgEl.onerror = function () {
      if (attemptIndex < fallbacks.length) {
        const nextSrc = fallbacks[attemptIndex++];
        imgEl.src = nextSrc;
      } else {
        imgEl.onerror = null;
      }
    };
  }

  function applyStaticTranslations(lang) {
    const t = uiText[lang] || uiText.id;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.getElementById("page-title").textContent = t.pageTitle;
    document.getElementById("brand-title").textContent = t.brandTitle;
    document.getElementById("brand-tagline").textContent = t.brandTagline;

    document.getElementById("about-blog-title").textContent = t.aboutBlogTitle;
    document.getElementById("about-blog-desc").textContent = t.aboutBlogDesc;
    document.getElementById("about-author-title").textContent = t.aboutAuthorTitle;
    document.getElementById("about-author-desc").innerHTML = t.aboutAuthorDesc;
    document.getElementById("about-contact-title").textContent = t.aboutContactTitle;
    document.getElementById("about-linkedin-label").textContent = t.linkedinLabel;

    document.getElementById("footer-text").textContent = t.footerText;
    document.getElementById("footer-about-link").textContent = t.footerAboutLink;

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  function renderPartFilters(list, lang) {
    const container = document.getElementById("part-filters");
    const t = uiText[lang] || uiText.id;
    container.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "filter-btn" + (selectedPart === "all" ? " active" : "");
    allBtn.textContent = t.allParts;
    allBtn.addEventListener("click", function () {
      selectedPart = "all";
      renderAll();
    });
    container.appendChild(allBtn);

    const seenKeys = new Set();
    list.forEach((article, idx) => {
      const key = getPartKey(article, idx);
      if (seenKeys.has(key)) return;
      seenKeys.add(key);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-btn" + (selectedPart === key ? " active" : "");
      btn.textContent = formatPartLabel(article, lang, idx);
      btn.addEventListener("click", function () {
        selectedPart = key;
        renderAll();
      });
      container.appendChild(btn);
    });
  }

  function renderArticles(list, lang) {
    const grid = document.getElementById("articles-grid");
    const t = uiText[lang] || uiText.id;
    grid.innerHTML = "";

    const filtered = list.filter((article, idx) => {
      if (selectedPart === "all") return true;
      return getPartKey(article, idx) === selectedPart;
    });

    if (filtered.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = t.emptyArticles;
      grid.appendChild(emptyMsg);
      return;
    }

    filtered.forEach((article, idx) => {
      const block = getLangBlock(article, lang);
      const title = toSafeText(block.title, lang);
      const excerpt = toSafeText(block.excerpt || block.summary, lang);
      const partText = formatPartLabel(article, lang, idx);

      const card = document.createElement("article");
      card.className = "article-card";

      const images = Array.isArray(article.images) ? article.images : [];
      if (images.length > 0) {
        const thumbWrap = document.createElement("div");
        thumbWrap.className = "article-thumb-wrap";
        const img = document.createElement("img");
        img.className = "article-thumb";
        attachSmartImage(img, images[0], title);
        thumbWrap.appendChild(img);
        card.appendChild(thumbWrap);
      }

      const body = document.createElement("div");
      body.className = "article-body";

      const partEl = document.createElement("p");
      partEl.className = "article-part";
      partEl.textContent = partText;

      const titleEl = document.createElement("h3");
      titleEl.className = "article-title";
      titleEl.textContent = title;

      const summaryEl = document.createElement("p");
      summaryEl.className = "article-summary";
      summaryEl.textContent = excerpt;

      const readBtn = document.createElement("button");
      readBtn.type = "button";
      readBtn.className = "read-btn";
      readBtn.textContent = t.readMore;
      readBtn.addEventListener("click", function () {
        openModal(article, lang, idx);
      });

      body.appendChild(partEl);
      body.appendChild(titleEl);
      body.appendChild(summaryEl);
      body.appendChild(readBtn);

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function openModal(article, lang, idx) {
    const block = getLangBlock(article, lang);
    const modal = document.getElementById("article-modal");
    const partEl = document.getElementById("modal-part");
    const titleEl = document.getElementById("modal-title");
    const imagesEl = document.getElementById("modal-images");
    const contentEl = document.getElementById("modal-content");

    const title = toSafeText(block.title, lang);
    partEl.textContent = formatPartLabel(article, lang, idx);
    titleEl.textContent = title;

    imagesEl.innerHTML = "";
    const images = Array.isArray(article.images) ? article.images : [];
    images.forEach((src) => {
      const img = document.createElement("img");
      attachSmartImage(img, src, title);
      imagesEl.appendChild(img);
    });

    contentEl.innerHTML = toSafeText(block.content, lang);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    const modal = document.getElementById("article-modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  function renderAll() {
    const list = getArticlesList();
    applyStaticTranslations(currentLang);
    renderPartFilters(list, currentLang);
    renderArticles(list, currentLang);
  }

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      currentLang = btn.dataset.lang || "id";
      localStorage.setItem(STORAGE_KEY, currentLang);
      renderAll();
    });
  });

  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-backdrop").addEventListener("click", closeModal);
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });

  renderAll();
})();