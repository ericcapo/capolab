// Data storage
const siteData = {
    currentPage: 'home',
    photos: [
        {
            id: 1,
            title: "Baltic Sea Expedition",
            date: "September 2024",
            description: "Collecting sediment samples from the Baltic Sea for sedDNA analysis.",
            imageUrl: "images/gallery/fieldwork-2024.jpg",
            category: "recent"
        },
        {
            id: 2,
            title: "Lab Meeting",
            date: "August 2024",
            description: "Weekly lab meeting discussing recent findings and future experiments.",
            imageUrl: "images/gallery/lab-meeting.jpg",
            category: "recent"
        },
        {
            id: 3,
            title: "Conference 2023",
            date: "November 2023",
            description: "Presenting research at the International Marine Science Conference.",
            imageUrl: "images/gallery/conference.jpg",
            category: "archive"
        },
        {
            id: 4,
            title: "Field Equipment Testing",
            date: "June 2024",
            description: "Testing new sediment coring equipment in the coastal zone.",
            imageUrl: "images/gallery/equipment-testing.jpg",
            category: "recent"
        }
    ],
    activePhoto: null
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

// Form submission handler
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };
    
    console.log('Form submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}

// Page renderers
function renderHome() {
    return `
        <div class="hero">
            <h1>Welcome to Capo Lab</h1>
            <p>Advancing marine science through innovative research and collaboration</p>
        </div>
        
        <div class="gallery-section">
            <h2 class="section-title">Recent Gallery Highlights</h2>
            <div class="gallery-grid">
                ${siteData.photos.filter(p => p.category === 'recent').slice(0, 3).map(photo => `
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
        
        <div class="contact-form">
            <h2 class="section-title" style="margin-top: 0;">Contact Us</h2>
            <form onsubmit="handleFormSubmit(event)">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn">Send Message</button>
            </form>
        </div>
    `;
}

function renderGallery() {
    const recentPhotos = siteData.photos.filter(p => p.category === 'recent');
    const archivePhotos = siteData.photos.filter(p => p.category === 'archive');
    
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

function renderAbout() {
    return `
        <h1 class="section-title">About Capo Lab</h1>
        
        <div style="background: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem;">
            <h2>Our Mission</h2>
            <p>Capo Lab is dedicated to advancing our understanding of marine ecosystems through innovative research methods, including sedDNA analysis, environmental monitoring, and ecological modeling.</p>
        </div>
        
        <div style="background: white; padding: 2rem; border-radius: 10px;">
            <h2>Research Focus</h2>
            <ul style="margin-top: 1rem; margin-left: 1.5rem;">
                <li>Sedimentary DNA (sedDNA) analysis</li>
                <li>Marine ecosystem dynamics</li>
                <li>Climate change impacts on coastal zones</li>
                <li>Biodiversity monitoring</li>
            </ul>
        </div>
        
        <div class="contact-form" style="margin-top: 2rem;">
            <h2 class="section-title" style="margin-top: 0;">Get in Touch</h2>
            <form onsubmit="handleFormSubmit(event)">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="message">Message</label>
                    <textarea id="message" name="message" rows="4" required></textarea>
                </div>
                <button type="submit" class="btn">Send Message</button>
            </form>
        </div>
    `;
}

function renderPublications() {
    return `
        <h1 class="section-title">Publications</h1>
        
        <div style="background: white; padding: 2rem; border-radius: 10px;">
            <div style="margin-bottom: 2rem;">
                <h3>2024</h3>
                <p>Smith, J., et al. "Sedimentary DNA reveals historical biodiversity changes in the Baltic Sea." <em>Marine Ecology Progress Series</em>, 2024.</p>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h3>2023</h3>
                <p>Johnson, A., Capo, E., et al. "Ancient DNA from sediment cores: A new frontier in marine paleoecology." <em>Nature Reviews Earth & Environment</em>, 4, 234-248.</p>
            </div>
            
            <div>
                <h3>2022</h3>
                <p>Capo, E., et al. "Long-term dynamics of marine microbial communities revealed by sedimentary DNA." <em>ISME Journal</em>, 16, 1245-1256.</p>
            </div>
        </div>
    `;
}

// Main render function
function render() {
    const app = document.getElementById('app');
    if (!app) return;
    
    let content = '';
    
    // Navigation
    content += `
        <nav>
            <div class="nav-container">
                <a href="#" onclick="navigateTo('home'); return false;" class="logo">Capo Lab</a>
                <ul class="nav-links">
                    <li><a href="#" data-page="home" onclick="navigateTo('home'); return false;">Home</a></li>
                    <li><a href="#" data-page="gallery" onclick="navigateTo('gallery'); return false;">Gallery</a></li>
                    <li><a href="#" data-page="publications" onclick="navigateTo('publications'); return false;">Publications</a></li>
                    <li><a href="#" data-page="about" onclick="navigateTo('about'); return false;">About</a></li>
                </ul>
            </div>
        </nav>
        
        <div class="container">
            ${siteData.currentPage === 'home' ? renderHome() : ''}
            ${siteData.currentPage === 'gallery' ? renderGallery() : ''}
            ${siteData.currentPage === 'about' ? renderAbout() : ''}
            ${siteData.currentPage === 'publications' ? renderPublications() : ''}
        </div>
        
        <footer>
            <p>© 2024 Capo Lab. All rights reserved.</p>
            <p style="margin-top: 0.5rem; font-size: 0.85rem;">Contact: capo.lab@university.edu</p>
        </footer>
        
        <div id="modal" class="modal">
            <div id="modal-content"></div>
        </div>
    `;
    
    app.innerHTML = content;
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
