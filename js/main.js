// main.js – SPA with translation toggles + Micromates card game
const siteData = {
    currentPage: 'home',
    activePhoto: null,
    pageContent: {},
    newsItems: []
};

// Navigation
function navigateTo(page) {
    siteData.currentPage = page;
    render();
    updateActiveNav();
}

function updateActiveNav() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        const pageName = link.getAttribute('data-page');
        if (pageName === siteData.currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Modal functions (for team photos)
function openModal(photo) {
    siteData.activePhoto = photo;
    const modal = document.getElementById('modal');
    if (modal) modal.classList.add('active');
    renderModal();
}
function closeModal() {
    siteData.activePhoto = null;
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
}
function renderModal() {
    if (!siteData.activePhoto) return;
    const modalContent = document.getElementById('modal-content');
    if (modalContent) {
        modalContent.innerHTML = `
            <span class="modal-close" onclick="closeModal()">&times;</span>
            <div class="modal-content">
                <img src="${siteData.activePhoto.imageUrl}" alt="${siteData.activePhoto.title}" class="modal-img">
            </div>
        `;
    }
}

// News parsing (unchanged)
function parseDateFlexible(dateStr) { /* ... keep existing ... */ }
function parseNewsItems(html) { /* ... keep existing ... */ }
async function loadPageContent(page) { /* ... keep existing ... */ }
function getFallbackNews() { /* ... keep existing ... */ }
function enhancePublications() { /* ... keep existing ... */ }

// ----- HOME PAGE TRANSLATION -----
const chineseIntroTranslation = `我们研究水生微生物群落的时空动态及其对环境变化（如气候变化、富营养化、脱氧或汞污染）的功能响应。我们应用分子生态学方法，如元条形码、（古）宏基因组学、基于MAGs的分析和宏转录组学。通过对水柱和下方沉积物档案中的遗传信息进行测序，我们研究水生微生物生命的长期变化，以更好地理解它们当前和未来的发展轨迹。`;
let originalEnglishHTML = '';
let isChineseActive = false;

function initHomePageTranslation() {
    const toggleButton = document.querySelector('.cn-intro-btn');
    if (!toggleButton) return;
    const textParagraph = document.querySelector('.lab-intro-text p');
    if (!textParagraph) return;
    if (!originalEnglishHTML) originalEnglishHTML = textParagraph.innerHTML;
    const newButton = toggleButton.cloneNode(true);
    toggleButton.parentNode.replaceChild(newButton, toggleButton);
    newButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isChineseActive) {
            textParagraph.innerHTML = chineseIntroTranslation;
            newButton.textContent = 'ENG';
            isChineseActive = true;
        } else {
            textParagraph.innerHTML = originalEnglishHTML;
            newButton.textContent = '中文';
            isChineseActive = false;
        }
    });
    newButton.textContent = '中文';
    isChineseActive = false;
}

// ----- RESEARCH PAGE TRANSLATIONS -----
const researchChineseTexts = {
    1: `<p>我们研究湖泊表层水和底层沉积物中活跃微生物层的微生物多样性。我们开发了一种无人机采样方法，为大量湖泊采集样本，并首次提供了瑞典湖泊微生物多样性的目录。</p>
        <p><strong>方法：</strong> 无人机水质采样、沉积物岩芯采集、元条形码、宏基因组学</p>`,
    2: `<p>由于气候变暖和营养盐污染，水体氧最小区正在扩大。我们研究微生物群落（细菌、古菌、原生生物）如何响应持续的脱氧过程。我们解析功能转变、代谢适应以及对生物地球化学循环（氮、硫、碳）的级联效应，以及神经毒素甲基汞的形成。</p>
        <p><strong>方法：</strong> 水样采集、沉积物岩芯采集、元条形码、宏基因组学、基于基因组的宏转录组学</p>`,
    3: `<p>我们利用沉积物古DNA（sedDNA）重建淡水与海洋微生物群落数百年至千年尺度的历史变化。通过分析沉积物中保存的遗传记录，揭示微生物组合如何响应气候变迁、富营养化、脱氧及其他环境压力。</p>
        <p><strong>方法：</strong> 沉积物岩芯采集、古宏基因组学、系统发育基因组学</p>`
};
function initResearchPageTranslations() { /* ... keep existing ... */ }

// ======================== MICROMATES PAGE MODULE ========================
let micromatesInitialized = false;
let currentCarouselOffset = 0;        // slide index (0 = first card visible)
const TOTAL_CARDS = 55;
const CARDS_VISIBLE = 5;
let selectedCardIndex = 0;
let activeInfoModal = null;

function getCardImagePath(cardNumber) {
    const padded = String(cardNumber).padStart(2, '0');
    return `images/mates/mates${padded}.jpg`;
}

function getCardDescription(cardIdx) {
    const num = cardIdx + 1;
    const descriptions = {
        1: "Origin Card: The Microbial Genesis – First spark of aquatic microbial life.",
        2: "Prokaryote Pioneer – Master of nutrient cycling.",
        3: "Cyanobacteria Whisperer – Oxygen revolution.",
        4: "Archaea Ancient – Methane metabolism in extremes.",
        5: "Horizontal Gene Transfer – Swap genetic traits.",
        // ... (full list from previous version, but for brevity include a fallback)
    };
    // Fallback for any missing number
    return descriptions[num] || `Card #${num}: Unique microbial strategy from aquatic ecosystems.`;
}

function buildMicromatesHTML() {
    return `
        <div class="micromates-wrapper">
            <div class="game-header">
                <div class="game-text-box">
                    <h2>🎴 MicroMates: Microbial Card Game</h2>
                    <p>Discover the hidden superpowers of aquatic microorganisms. Each poker‑sized card represents a unique microbial strategy – from mercury methylators to sediment DNA archivists. <strong>55 collectible cards</strong> based on real microbial ecology.</p>
                    <p><em>Click any card to select it, then press “Show card info” for a detailed description.</em></p>
                </div>
                <div class="game-right-img">
                    <img src="images/mates/micromates.jpg" alt="MicroMates logo" onerror="this.src='https://placehold.co/500x300?text=MicroMates'">
                </div>
            </div>
            <div class="carousel-container" id="micromatesCarousel">
                <div class="carousel-wrapper">
                    <button class="carousel-btn" id="carouselPrev">‹</button>
                    <div class="cards-scroll">
                        <div class="cards-track" id="cardsTrack"></div>
                    </div>
                    <button class="carousel-btn" id="carouselNext">›</button>
                </div>
            </div>
            <div class="info-btn-container">
                <button class="btn-card-info" id="showCardInfoBtn">📖 Show info about selected card</button>
            </div>
        </div>
    `;
}

function renderCarouselTrack() {
    const track = document.getElementById('cardsTrack');
    if (!track) return;
    let html = '';
    for (let i = 0; i < TOTAL_CARDS; i++) {
        const cardNum = i + 1;
        const imgPath = getCardImagePath(cardNum);
        const isSelected = (selectedCardIndex === i);
        html += `
            <div class="card-item ${isSelected ? 'selected' : ''}" data-card-index="${i}">
                <img src="${imgPath}" class="card-img" onerror="this.src='https://placehold.co/160x240?text=Card+${cardNum}'">
                <div class="card-label">#${cardNum}</div>
            </div>
        `;
    }
    track.innerHTML = html;
    // attach selection events
    document.querySelectorAll('.card-item').forEach(card => {
        const idx = parseInt(card.dataset.cardIndex);
        card.addEventListener('click', (e) => {
            selectedCardIndex = idx;
            renderCarouselTrack();          // re-render to update highlight
            updateCarouselPosition();       // keep position
        });
    });
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const track = document.getElementById('cardsTrack');
    if (!track) return;
    const cardWidth = 160 + 12; // width + gap (1.2rem = 12px)
    const maxOffset = Math.max(0, TOTAL_CARDS - CARDS_VISIBLE);
    let newOffset = currentCarouselOffset;
    if (newOffset > maxOffset) newOffset = maxOffset;
    if (newOffset < 0) newOffset = 0;
    currentCarouselOffset = newOffset;
    const translateX = - (currentCarouselOffset * cardWidth);
    track.style.transform = `translateX(${translateX}px)`;
    // enable/disable buttons
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (prevBtn) prevBtn.disabled = (currentCarouselOffset === 0);
    if (nextBtn) nextBtn.disabled = (currentCarouselOffset >= maxOffset);
}

function moveCarousel(direction) {
    if (direction === 'prev' && currentCarouselOffset > 0) {
        currentCarouselOffset--;
        updateCarouselPosition();
    } else if (direction === 'next') {
        const maxOffset = Math.max(0, TOTAL_CARDS - CARDS_VISIBLE);
        if (currentCarouselOffset < maxOffset) {
            currentCarouselOffset++;
            updateCarouselPosition();
        }
    }
}

function showCardInfoModal() {
    if (!activeInfoModal) {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'cardInfoModal';
        modalDiv.className = 'card-info-modal';
        modalDiv.innerHTML = `
            <div class="info-modal-content">
                <span class="close-info-modal">&times;</span>
                <h3 id="infoModalTitle">MicroMate Details</h3>
                <p id="infoModalText"></p>
                <button class="btn" id="closeInfoBtn">Close</button>
            </div>
        `;
        document.body.appendChild(modalDiv);
        activeInfoModal = modalDiv;
        const closeSpan = modalDiv.querySelector('.close-info-modal');
        const closeBtn = modalDiv.querySelector('#closeInfoBtn');
        const closeFn = () => modalDiv.classList.remove('active');
        closeSpan.addEventListener('click', closeFn);
        closeBtn.addEventListener('click', closeFn);
        modalDiv.addEventListener('click', (e) => { if (e.target === modalDiv) closeFn(); });
    }
    const titleEl = activeInfoModal.querySelector('#infoModalTitle');
    const textEl = activeInfoModal.querySelector('#infoModalText');
    titleEl.innerHTML = `🎴 MicroMate #${selectedCardIndex+1}`;
    textEl.innerHTML = getCardDescription(selectedCardIndex);
    activeInfoModal.classList.add('active');
}

function initMicromatesPage() {
    if (micromatesInitialized) return;
    const container = document.querySelector('.micromates-wrapper');
    if (!container) return;
    // attach events after DOM is ready
    setTimeout(() => {
        renderCarouselTrack();
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const infoBtn = document.getElementById('showCardInfoBtn');
        if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel('next'));
        if (infoBtn) infoBtn.addEventListener('click', showCardInfoModal);
        micromatesInitialized = true;
    }, 50);
}

// ----- RENDER HOME (unchanged except adding Micromates link) -----
function renderHome() {
    const topNews = siteData.newsItems.slice(0, 3);
    const newsHtml = topNews.length ? topNews.map(news => `...`).join('') : `<div class="news-card">...</div>`;
    return `
        <div class="hero">...</div>
        <div class="lab-intro">...</div>
        <div class="news-section">...</div>
    `;
} // (keep original content – same as before)

// Main render
async function render() {
    const app = document.getElementById('app');
    if (!app) return;
    const navigation = `
        <nav>
            <div class="nav-container">
                <a href="#" onclick="navigateTo('home'); return false;" class="logo">Capo Lab</a>
                <ul class="nav-links">
                    <li><a href="#" data-page="home" onclick="navigateTo('home'); return false;">Home</a></li>
                    <li><a href="#" data-page="research" onclick="navigateTo('research'); return false;">Research</a></li>
                    <li><a href="#" data-page="micromates" onclick="navigateTo('micromates'); return false;">MicroMates</a></li>
                    <li><a href="#" data-page="team" onclick="navigateTo('team'); return false;">Team</a></li>
                    <li><a href="#" data-page="news" onclick="navigateTo('news'); return false;">News</a></li>
                    <li><a href="#" data-page="publications" onclick="navigateTo('publications'); return false;">Publications</a></li>
                </ul>
            </div>
        </nav>
        <div class="container" id="page-container"></div>
        <footer>...</footer>
        <div id="modal" class="modal"><div id="modal-content"></div></div>
    `;
    app.innerHTML = navigation;
    if (!siteData.newsItems.length) await loadPageContent('news');
    const pageContainer = document.getElementById('page-container');
    let content = '';
    if (siteData.currentPage === 'home') {
        content = renderHome();
        pageContainer.innerHTML = content;
        initHomePageTranslation();
    } else if (siteData.currentPage === 'micromates') {
        content = buildMicromatesHTML();
        pageContainer.innerHTML = content;
        initMicromatesPage();
    } else if (siteData.currentPage === 'research') {
        content = await loadPageContent('research');
        pageContainer.innerHTML = content;
        initResearchPageTranslations();
    } else {
        content = await loadPageContent(siteData.currentPage);
        pageContainer.innerHTML = content;
        if (siteData.currentPage === 'publications') enhancePublications();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    render();
    document.addEventListener('click', (e) => { if (e.target === document.getElementById('modal')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
});

// Attach globals
window.navigateTo = navigateTo;
window.closeModal = closeModal;
window.openModal = openModal;
