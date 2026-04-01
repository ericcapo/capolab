// main.js
// Data storage
const siteData = {
    currentPage: 'home',
    activePhoto: null,
    pageContent: {}, // Cache for loaded HTML content
    newsItems: [], // Store parsed news items
    galleryItems: {
        recent: [],
        archive: []
    } // Store parsed gallery items
};

// Navigation handler
function navigateTo(page) {
    siteData.currentPage = page;
    render();
    updateActiveNav();
}

// Update active navigation link
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

// Modal functions
function openModal(photo) {
    siteData.activePhoto = photo;
    const modal = document.getElementById('modal');
    modal.classList.add('active');
    renderModal();
}

function closeModal() {
    siteData.activePhoto = null;
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
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

// Parse news HTML to extract items
function parseNewsItems(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newsItems = [];
    
    // Find all news-item divs
    const items = doc.querySelectorAll('.news-item');
    items.forEach(item => {
        const dateElem = item.querySelector('.news-date');
        const titleElem = item.querySelector('.news-title');
        const summaryElem = item.querySelector('.news-summary');
        
        if (dateElem && titleElem && summaryElem) {
            newsItems.push({
                date: dateElem.textContent.trim(),
                title: titleElem.textContent.trim(),
                summary: summaryElem.textContent.trim()
            });
        }
    });
    
    return newsItems;
}

// Parse gallery HTML to extract photos
function parseGalleryItems(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const recent = [];
    const archive = [];
    let photoId = 1;
    
    // Find all photo cards
    const photoCards = doc.querySelectorAll('.photo-card');
    photoCards.forEach(card => {
        const img = card.querySelector('img');
        const titleElem = card.querySelector('.photo-title');
        const dateElem = card.querySelector('.photo-date');
        const descElem = card.querySelector('.photo-description');
        
        // Determine category based on section heading or default to recent
        let category = 'recent';
        const parentSection = card.closest('.gallery-section');
        if (parentSection) {
            const heading = parentSection.querySelector('h2');
            if (heading && heading.textContent.includes('Archive')) {
                category = 'archive';
            }
        }
        
        if (img && titleElem && dateElem && descElem) {
            const photo = {
                id: photoId++,
                title: titleElem.textContent.trim(),
                date: dateElem.textContent.trim(),
                description: descElem.textContent.trim(),
                imageUrl: img.getAttribute('src'),
                category: category
            };
            
            if (category === 'recent') {
                recent.push(photo);
            } else {
                archive.push(photo);
            }
        }
    });
    
    return { recent, archive };
}

// Load HTML content from external files
async function loadPageContent(page) {
    // Check if content is already cached
    if (siteData.pageContent[page]) {
        return siteData.pageContent[page];
    }
    
    try {
        const response = await fetch(`${page}.html`);
        if (!response.ok) throw new Error(`Failed to load ${page}.html`);
        const content = await response.text();
        siteData.pageContent[page] = content;
        
        // If loading news page, parse and store news items
        if (page === 'news') {
            siteData.newsItems = parseNewsItems(content);
        }
        
        // If loading gallery page, parse and store gallery items
        if (page === 'gallery') {
            const { recent, archive } = parseGalleryItems(content);
            siteData.galleryItems.recent = recent;
            siteData.galleryItems.archive = archive;
        }
        
        return content;
    } catch (error) {
        console.error(error);
        return `<h1 class="section-title">${page.charAt(0).toUpperCase() + page.slice(1)}</h1><p>Content coming soon...</p>`;
    }
}

// Render home page with top 3 news items and recent photos
function renderHome() {
    // Get top 3 news items
    const topNews = siteData.newsItems.slice(0, 3);
    
    // Get top 3 recent photos
    const topPhotos = siteData.galleryItems.recent.slice(0, 3);
    
    return `
        <div class="hero">
            <h1>Welcome to Capo Lab</h1>
            <p>We explore the life of microorganisms in marine and freshwater systems</p>
        </div>
        
        <div class="lab-intro">
            <div class="lab-intro-text">
                <h2>Our Research</h2>
                <p>We aim to understand the spatio-temporal dynamics of microbial communities and their functional responses to environmental change, such as climate change, eutrophication, mercury pollution or coral bleaching. One of our research lines are centered on investigating the consequences of deoxygenation of water columns on microbial processes and related ecosystem services. We apply molecular ecology methods, such as metabarcoding, (ancient) metagenomics, MAGs-based analysis and metatranscriptomics. We rely on molecular paleoecology approaches, based on sedimentary DNA sequencing to reconstruct past changes in aquatic ecosystems. By combining genetic information from past and modern environments, we strive to shed light on the intricate relationships between microbial communities and their environment.</p>
            </div>
            <div class="lab-intro-image">
                <img src="images/team2025.png" alt="Capo Lab Team 2025" onerror="this.src='https://via.placeholder.com/400x300?text=Team+Photo+2025'">
            </div>
        </div>
        
        <div class="news-section">
            <h2 class="section-title">Latest News</h2>
            <div class="news-grid">
                ${topNews.map(news => `
                    <div class="news-card">
                        <div class="news-date">${news.date}</div>
                        <div class="news-title">${news.title}</div>
                        <div class="news-summary">${news.summary}</div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn" onclick="navigateTo('news')">View All News →</button>
            </div>
        </div>
        
        <div class="gallery-section">
            <h2 class="section-title">Recent Photos</h2>
            <div class="gallery-grid">
                ${topPhotos.map(photo => `
                    <div class="photo-card" onclick="openModal(${JSON.stringify(photo).replace(/"/g, '&quot;')})">
                        <img src="${photo.imageUrl}" alt="${photo.title}" class="photo-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                        <div class="photo-info">
                            <div class="photo-title">${photo.title}</div>
                            <div class="photo-date">${photo.date}</div>
                            <div class="photo-description">${photo.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="btn" onclick="navigateTo('gallery')">View Full Gallery →</button>
            </div>
        </div>
    `;
}

function renderGallery() {
    const recentPhotos = siteData.galleryItems.recent;
    const archivePhotos = siteData.galleryItems.archive;
    
    return `
        <h1 class="section-title">Lab Gallery</h1>
        <p>Explore moments from our lab activities, field work, and team events.</p>
        
        <div class="gallery-section">
            <h2 class="section-title">Recent Photos</h2>
            <div class="gallery-grid">
                ${recentPhotos.map(photo => `
                    <div class="photo-card" onclick="openModal(${JSON.stringify(photo).replace(/"/g, '&quot;')})">
                        <img src="${photo.imageUrl}" alt="${photo.title}" class="photo-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                        <div class="photo-info">
                            <div class="photo-title">${photo.title}</div>
                            <div class="photo-date">${photo.date}</div>
                            <div class="photo-description">${photo.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${archivePhotos.length > 0 ? `
            <div class="gallery-section">
                <h2 class="section-title">Archive Photos</h2>
                <div class="gallery-grid">
                    ${archivePhotos.map(photo => `
                        <div class="photo-card" onclick="openModal(${JSON.stringify(photo).replace(/"/g, '&quot;')})">
                            <img src="${photo.imageUrl}" alt="${photo.title}" class="photo-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                            <div class="photo-info">
                                <div class="photo-title">${photo.title}</div>
                                <div class="photo-date">${photo.date}</div>
                                <div class="photo-description">${photo.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;
}

// Main render function
async function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    // Navigation
    const navigation = `
        <nav>
            <div class="nav-container">
                <a href="#" onclick="navigateTo('home'); return false;" class="logo">Capo Lab</a>
                <ul class="nav-links">
                    <li><a href="#" data-page="home" onclick="navigateTo('home'); return false;">Home</a></li>
                    <li><a href="#" data-page="research" onclick="navigateTo('research'); return false;">Research</a></li>
                    <li><a href="#" data-page="team" onclick="navigateTo('team'); return false;">Team</a></li>
                    <li><a href="#" data-page="news" onclick="navigateTo('news'); return false;">News</a></li>
                    <li><a href="#" data-page="publications" onclick="navigateTo('publications'); return false;">Publications</a></li>
                    <li><a href="#" data-page="gallery" onclick="navigateTo('gallery'); return false;">Gallery</a></li>
                </ul>
            </div>
        </nav>
        
        <div class="container" id="page-container">
            <!-- Dynamic content will be loaded here -->
        </div>
        
        <footer>
            <p>Contact: <a href="mailto:eric.capo@umu.se">eric.capo@umu.se</a></p>
            <p style="margin-top: 0.5rem; font-size: 0.85rem;">Department of Ecology, Environment and Geoscience, Umeå University (Umeå, Sweden)</p>
        </footer>
        
        <div id="modal" class="modal">
            <div id="modal-content"></div>
        </div>
    `;
    
    app.innerHTML = navigation;
    
    // Pre-load news and gallery content to get data for home page
    if (!siteData.newsItems.length) {
        await loadPageContent('news');
    }
    if (!siteData.galleryItems.recent.length) {
        await loadPageContent('gallery');
    }
    
    // Load content for current page
    const pageContainer = document.getElementById('page-container');
    let content = '';
    
    if (siteData.currentPage === 'home') {
        content = renderHome();
    } else if (siteData.currentPage === 'gallery') {
        content = renderGallery();
    } else {
        // Load from external HTML files for research, team, news, publications
        content = await loadPageContent(siteData.currentPage);
    }
    
    pageContainer.innerHTML = content;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    render();
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('modal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
