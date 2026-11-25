document.addEventListener("DOMContentLoaded", () => {
  let currentLang = localStorage.getItem("lsbd_lang") || "id";
  let activeArticleId = null;

  const uiLabels = {
    en: {
      tagline: "Character, curiosity, and everyday growth for children",
      heroBadge: "✨ Family Learning & Story Space",
      heroTitle: "Little Steps Big Dreams",
      heroSubtitle: "Stories and reflections on character education, tolerance, fun learning, P5 projects, and Montessori-inspired independence.",
      readMore: "Read Story →",
      backBtn: "← Back to All Stories",
      footer: "© Little Steps Big Dreams — Multilingual Stories on Early Childhood & Character Growth"
    },
    id: {
      tagline: "Karakter, rasa ingin tahu, dan tumbuh kembang anak sehari-hari",
      heroBadge: "✨ Ruang Belajar & Cerita Keluarga",
      heroTitle: "Little Steps Big Dreams",
      heroSubtitle: "Cerita dan refleksi seputar pendidikan karakter, toleransi, fun learning, proyek P5, serta kemandirian ala Montessori.",
      readMore: "Baca Cerita →",
      backBtn: "← Kembali ke Daftar Cerita",
      footer: "© Little Steps Big Dreams — Cerita Multibahasa tentang Anak, Karakter, dan Pembelajaran"
    },
    zh: {
      tagline: "陪伴孩子在品格、好奇心与日常实践中成长",
      heroBadge: "✨ 家庭学习与成长故事空间",
      heroTitle: "Little Steps Big Dreams",
      heroSubtitle: "关于品格教育、宗教宽容、趣味学习、P5 项目式学习与蒙特梭利独立能力的故事与随笔。",
      readMore: "阅读全文 →",
      backBtn: "← 返回故事列表",
      footer: "© Little Steps Big Dreams — 儿童品格与成长多语言博客"
    }
  };

  const homeView = document.getElementById("homeView");
  const articleView = document.getElementById("articleView");
  const articlesGrid = document.getElementById("articlesGrid");
  const articlePartBadge = document.getElementById("articlePartBadge");
  const articleTitle = document.getElementById("articleTitle");
  const articleGallery = document.getElementById("articleGallery");
  const articleBody = document.getElementById("articleBody");
  const backBtn = document.getElementById("backBtn");
  const backBtnBottom = document.getElementById("backBtnBottom");
  const brandLink = document.getElementById("brandLink");
  const langButtons = document.querySelectorAll(".lang-btn");

  const dataList = typeof articlesData !== "undefined" && Array.isArray(articlesData) ? articlesData : [];

  function updateUIText() {
    const labels = uiLabels[currentLang] || uiLabels.id;
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : currentLang;
    document.getElementById("siteTagline").textContent = labels.tagline;
    document.getElementById("heroBadge").textContent = labels.heroBadge;
    document.getElementById("heroTitle").textContent = labels.heroTitle;
    document.getElementById("heroSubtitle").textContent = labels.heroSubtitle;
    document.getElementById("footerText").textContent = labels.footer;
    backBtn.textContent = labels.backBtn;
    backBtnBottom.textContent = labels.backBtn;

    langButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === currentLang);
    });
  }

  function renderArticlesList() {
    articlesGrid.innerHTML = "";
    const labels = uiLabels[currentLang] || uiLabels.id;

    dataList.forEach((item, index) => {
      const langData = item[currentLang] || item.id || item.en || {};
      const thumbSrc = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "";

      const card = document.createElement("article");
      card.className = "article-card";

      const topSection = document.createElement("div");

      if (thumbSrc) {
        const thumbWrap = document.createElement("div");
        thumbWrap.className = "card-thumb-wrap";

        const img = document.createElement("img");
        img.src = thumbSrc;
        img.alt = langData.title || "";
        img.className = "card-thumb";
        img.loading = "lazy";
        img.onerror = () => {
          thumbWrap.style.display = "none";
        };

        thumbWrap.appendChild(img);
        topSection.appendChild(thumbWrap);
      }

      const contentBox = document.createElement("div");
      contentBox.className = "card-content";

      const partTag = document.createElement("span");
      partTag.className = "card-part";
      partTag.textContent = `PART ${index + 1}`;

      const titleEl = document.createElement("h3");
      titleEl.className = "card-title";
      titleEl.textContent = langData.title || "";

      const excerptEl = document.createElement("p");
      excerptEl.className = "card-excerpt";
      excerptEl.textContent = langData.excerpt || "";

      contentBox.appendChild(partTag);
      contentBox.appendChild(titleEl);
      contentBox.appendChild(excerptEl);
      topSection.appendChild(contentBox);

      const footerBox = document.createElement("div");
      footerBox.className = "card-footer";

      const readBtn = document.createElement("button");
      readBtn.type = "button";
      readBtn.className = "read-btn";
      readBtn.textContent = labels.readMore;
      readBtn.addEventListener("click", () => {
        openArticle(item.id);
      });

      footerBox.appendChild(readBtn);
      card.appendChild(topSection);
      card.appendChild(footerBox);
      articlesGrid.appendChild(card);
    });
  }

  function openArticle(articleId) {
    const itemIndex = dataList.findIndex((a) => a.id === articleId);
    if (itemIndex === -1) return;

    const item = dataList[itemIndex];
    activeArticleId = articleId;
    const langData = item[currentLang] || item.id || item.en || {};

    articlePartBadge.textContent = `PART ${itemIndex + 1}`;
    articleTitle.textContent = langData.title || "";
    articleBody.innerHTML = langData.content || "";

    articleGallery.innerHTML = "";
    if (Array.isArray(item.images)) {
      item.images.forEach((imgPath) => {
        const img = document.createElement("img");
        img.src = imgPath;
        img.alt = langData.title || "";
        img.onerror = () => {
          img.style.display = "none";
        };
        articleGallery.appendChild(img);
      });
    }

    homeView.classList.add("hidden");
    articleView.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showHome() {
    activeArticleId = null;
    articleView.classList.add("hidden");
    homeView.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLang = btn.dataset.lang || "id";
      localStorage.setItem("lsbd_lang", currentLang);
      updateUIText();
      renderArticlesList();
      if (activeArticleId) {
        openArticle(activeArticleId);
      }
    });
  });

  backBtn.addEventListener("click", showHome);
  backBtnBottom.addEventListener("click", showHome);
  brandLink.addEventListener("click", (e) => {
    e.preventDefault();
    showHome();
  });

  updateUIText();
  renderArticlesList();
});
