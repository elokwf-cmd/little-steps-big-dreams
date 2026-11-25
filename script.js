let currentLang = "en";
let activeArticleId = null;

const uiLabels = {
  en: {
    tagline: "Character, curiosity, and everyday growth for children",
    heroTitle: "Little Steps Big Dreams",
    heroSubtitle: "Stories and reflections on character education, tolerance, fun learning, P5 projects, and Montessori-inspired independence.",
    readMore: "Read Story →",
    backBtn: "← Back to All Stories",
    footer: "© Little Steps Big Dreams — Multilingual Stories on Early Childhood & Character Growth"
  },
  id: {
    tagline: "Karakter, rasa ingin tahu, dan tumbuh kembang anak sehari-hari",
    heroTitle: "Little Steps Big Dreams",
    heroSubtitle: "Cerita dan refleksi seputar pendidikan karakter, toleransi, fun learning, proyek P5, serta kemandirian ala Montessori.",
    readMore: "Baca Cerita →",
    backBtn: "← Kembali ke Daftar Cerita",
    footer: "© Little Steps Big Dreams — Cerita Multibahasa tentang Anak, Karakter, dan Pembelajaran"
  },
  zh: {
    tagline: "陪伴孩子在品格、好奇心与日常实践中成长",
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
const articleTitle = document.getElementById("articleTitle");
const articleGallery = document.getElementById("articleGallery");
const articleBody = document.getElementById("articleBody");
const backBtn = document.getElementById("backBtn");
const backBtnBottom = document.getElementById("backBtnBottom");
const brandLink = document.getElementById("brandLink");
const langButtons = document.querySelectorAll(".lang-btn");

function updateUIText() {
  const labels = uiLabels[currentLang];
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : currentLang;
  document.getElementById("siteTagline").textContent = labels.tagline;
  document.getElementById("heroTitle").textContent = labels.heroTitle;
  document.getElementById("heroSubtitle").textContent = labels.heroSubtitle;
  document.getElementById("footerText").textContent = labels.footer;
  backBtn.textContent = labels.backBtn;
  backBtnBottom.textContent = labels.backBtn;
}

function renderArticlesList() {
  articlesGrid.innerHTML = "";
  const labels = uiLabels[currentLang];

  articlesData.forEach((item, index) => {
    const langData = item[currentLang] || item.en;
    const thumbSrc = item.images && item.images.length > 0 ? item.images[0] : "";

    const card = document.createElement("div");
    card.className = "article-card";
    card.innerHTML = `
      <div>
        ${thumbSrc ? `<img src="${thumbSrc}" alt="${langData.title}" class="card-thumb" onerror="this.style.display='none'">` : ""}
        <div class="card-content">
          <span class="card-part">PART ${index + 1}</span>
          <h3 class="card-title">${langData.title}</h3>
          <p class="card-excerpt">${langData.excerpt}</p>
        </div>
      </div>
      <div class="card-footer">
        <button type="button" class="read-btn" data-id="${item.id}">${labels.readMore}</button>
      </div>
    `;

    card.querySelector(".read-btn").addEventListener("click", () => {
      openArticle(item.id);
    });

    articlesGrid.appendChild(card);
  });
}

function openArticle(articleId) {
  const item = articlesData.find((a) => a.id === articleId);
  if (!item) return;

  activeArticleId = articleId;
  const langData = item[currentLang] || item.en;

  articleTitle.textContent = langData.title;
  articleBody.innerHTML = langData.content;

  articleGallery.innerHTML = "";
  if (Array.isArray(item.images)) {
    item.images.forEach((imgPath) => {
      const img = document.createElement("img");
      img.src = imgPath;
      img.alt = langData.title;
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
    currentLang = btn.dataset.lang;
    langButtons.forEach((b) => b.classList.toggle("active", b === btn));

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

// Inisialisasi awal
updateUIText();
renderArticlesList();