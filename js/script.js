// Sample movie data
const movies = {
    latest: [
        { id: 1, title: "Avengers: Endgame", rating: 4.8, description: "Superhero epic yang mengakhiri saga Infinity." },
        { id: 2, title: "Spider-Man: No Way Home", rating: 4.7, description: "Petualangan multiversal Spider-Man yang spektakuler." },
        { id: 3, title: "The Batman", rating: 4.5, description: "Versi gelap dan realistis dari Dark Knight." },
        { id: 4, title: "Top Gun: Maverick", rating: 4.6, description: "Sekuel yang memukau dari film klasik 1986." },
        { id: 5, title: "Black Panther", rating: 4.4, description: "Superhero Afrika yang revolusioner." },
        { id: 6, title: "Dune", rating: 4.3, description: "Adaptasi epik dari novel sci-fi klasik." },
        { id: 7, title: "No Time to Die", rating: 4.2, description: "Petualangan terakhir James Bond Daniel Craig." },
        { id: 8, title: "Fast X", rating: 4.0, description: "Aksi balapan yang semakin gila dan spektakuler." }
    ],
    weekly: [
        { id: 9, title: "John Wick 4", rating: 4.9, description: "Aksi pembunuh bayaran yang brutal dan stylish." },
        { id: 10, title: "Guardians Galaxy 3", rating: 4.7, description: "Petualangan akhir tim penjaga galaksi." },
        { id: 11, title: "Scream VI", rating: 4.1, description: "Horror slasher yang menegangkan di New York." },
        { id: 12, title: "Creed III", rating: 4.3, description: "Pertarungan emosional Adonis Creed." },
        { id: 13, title: "Ant-Man 3", rating: 4.0, description: "Petualangan quantum realm yang mengasyikkan." },
        { id: 14, title: "Cocaine Bear", rating: 3.8, description: "Komedi horror tentang beruang yang mabuk kokain." },
        { id: 15, title: "65", rating: 3.9, description: "Sci-fi survival di planet dinosaurus." },
        { id: 16, title: "Shazam 2", rating: 4.2, description: "Superhero remaja dengan kekuatan dewa." }
    ],
    topRated: [
        { id: 17, title: "The Godfather", rating: 5.0, description: "Masterpiece tentang keluarga mafia Italia." },
        { id: 18, title: "Pulp Fiction", rating: 4.9, description: "Film kultus Tarantino yang revolusioner." },
        { id: 19, title: "The Dark Knight", rating: 4.9, description: "Batman vs Joker dalam pertarungan filosofis." },
        { id: 20, title: "Schindler's List", rating: 4.8, description: "Drama perang yang mengharukan dan powerful." },
        { id: 21, title: "Forrest Gump", rating: 4.8, description: "Kisah hidup yang menyentuh dan inspiratif." },
        { id: 22, title: "Inception", rating: 4.7, description: "Thriller sci-fi tentang mimpi dalam mimpi." },
        { id: 23, title: "Goodfellas", rating: 4.7, description: "Kisah nyata kehidupan gangster Amerika." },
        { id: 24, title: "The Matrix", rating: 4.6, description: "Revolusi sinema dengan konsep realitas virtual." }
    ]
};

let watchlist = [];
let currentSlideIndex = { latest: 0, weekly: 0, topRated: 0 };
let selectedMovie = null;

// Initialize the page
function init() {
    generateMovieCards('latest-slider', movies.latest);
    generateMovieCards('weekly-slider', movies.weekly);
    generateMovieCards('top-rated-slider', movies.topRated);
    updateWatchlistDisplay();
}

// Generate movie cards
function generateMovieCards(containerId, movieList) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    movieList.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.onclick = () => {
            window.location.href = `movie-detail.html?id=${movie.id}`;
        };


        const stars = generateStars(movie.rating);

        movieCard.innerHTML = `
                    <div class="movie-poster">Movie Poster<br>${movie.title}</div>
                    <div class="movie-info">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-rating">
                            <div class="stars">${stars}</div>
                            <span>${movie.rating}/5</span>
                        </div>
                    </div>
                `;

        container.appendChild(movieCard);
    });

    function getMovieById(id) {
        const allMovies = [...movies.latest, ...movies.weekly, ...movies.topRated];
        return allMovies.find(movie => movie.id === id);
    }

    function loadMovieDetail() {
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'));
        const movie = getMovieById(id);

        if (!movie) {
            document.getElementById('modal-title').textContent = 'Film tidak ditemukan';
            return;
        }

        document.getElementById('modal-title').textContent = movie.title;
        document.getElementById('modal-description').textContent = movie.description;
        document.getElementById('modal-stars').innerHTML = generateStars(movie.rating);
        document.getElementById('modal-rating-text').textContent = `(${movie.rating}/5)`;
        selectedMovie = movie;
    }

}

// Generate star rating
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }

    if (hasHalfStar) {
        stars += '<span class="star">☆</span>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">☆</span>';
    }

    return stars;
}

// Slide movies
function slideMovies(containerId, direction) {
    const slider = document.querySelector(`#${containerId} .movie-slider`);
    const cardWidth = 215; // 200px + 15px gap
    const visibleCards = Math.floor(slider.parentElement.offsetWidth / cardWidth);
    const maxSlide = slider.children.length - visibleCards;

    let sectionKey = containerId.includes('latest') ? 'latest' :
        containerId.includes('weekly') ? 'weekly' : 'topRated';

    currentSlideIndex[sectionKey] += direction;

    if (currentSlideIndex[sectionKey] < 0) {
        currentSlideIndex[sectionKey] = 0;
    } else if (currentSlideIndex[sectionKey] > maxSlide) {
        currentSlideIndex[sectionKey] = maxSlide;
    }

    const translateX = -currentSlideIndex[sectionKey] * cardWidth;
    slider.style.transform = `translateX(${translateX}px)`;
}

// Open movie modal
function openMovieModal(movie) {
    selectedMovie = movie;
    document.getElementById('modal-title').textContent = movie.title;
    document.getElementById('modal-description').textContent = movie.description;
    document.getElementById('modal-stars').innerHTML = generateStars(movie.rating);
    document.getElementById('modal-rating-text').textContent = `(${movie.rating}/5)`;
    document.getElementById('movieModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
    selectedMovie = null;
}


// Add to watchlist
function addToWatchlist() {
    if (selectedMovie && !watchlist.find(movie => movie.id === selectedMovie.id)) {
        watchlist.push(selectedMovie);
        updateWatchlistDisplay();
        closeModal();
        alert(`${selectedMovie.title} berhasil ditambahkan ke watchlist!`);
    } else if (selectedMovie) {
        alert(`${selectedMovie.title} sudah ada di watchlist!`);
    }
}

function updateWatchlistDisplay() {
    console.log("Watchlist sekarang:", watchlist);
}

function closeModal() {
    console.log("Modal ditutup");
}

// Update watchlist display
function updateWatchlistDisplay() {
    const container = document.getElementById('watchlist-container');
    container.innerHTML = '';

    if (watchlist.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6); font-size: 1.2rem; margin-top: 2rem;">Watchlist kosong. Tambahkan film dari halaman home!</p>';
        return;
    }

    watchlist.forEach((movie, index) => {
        const watchlistItem = document.createElement('div');
        watchlistItem.className = 'watchlist-item';

        watchlistItem.innerHTML = `
                    <div class="watchlist-poster">Movie<br>Poster</div>
                    <div class="watchlist-info">
                        <h3>${movie.title}</h3>
                        <p style="color: rgba(255,255,255,0.7); margin: 0.5rem 0;">${movie.description}</p>
                        <div class="movie-rating">
                            <div class="stars">${generateStars(movie.rating)}</div>
                            <span>${movie.rating}/5</span>
                        </div>
                    </div>
                    <button class="rate-btn" onclick="rateMovie(${movie.id})">Rate Film</button>
                `;

        container.appendChild(watchlistItem);
    });
}

// Rate movie
function rateMovie(movieId) {
    const movie = watchlist.find(m => m.id === movieId);
    if (movie) {
        const rating = prompt(`Berikan rating untuk "${movie.title}" (1-5):`);
        if (rating && rating >= 1 && rating <= 5) {
            movie.userRating = parseFloat(rating);
            alert(`Terima kasih! Anda memberikan rating ${rating}/5 untuk ${movie.title}`);
            updateWatchlistDisplay();
        } else if (rating !== null) {
            alert('Rating harus antara 1-5!');
        }
    }
}

// Show page
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update navbar active state
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.style.color = '#ffffff';
    });

    const activeLink = document.querySelector(`.nav-links a[onclick="showPage('${pageId}')"]`);
    if (activeLink) {
        activeLink.style.color = '#e50914';
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const watchlistSearch = document.getElementById('watchlistSearch');

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        if (query.length > 0) {
            searchMovies(query);
        }
    });

    watchlistSearch.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        filterWatchlist(query);
    });
}

// Search movies
function searchMovies(query) {
    const allMovies = [...movies.latest, ...movies.weekly, ...movies.topRated];
    const results = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(query)
    );

    if (results.length > 0) {
        console.log('Search results:', results);
        // You can implement search results display here
        // For now, we'll just log the results
    }
}

// Filter watchlist
function filterWatchlist(query) {
    const container = document.getElementById('watchlist-container');
    const items = container.querySelectorAll('.watchlist-item');

    items.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Logout function
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        alert('Logout berhasil! Terima kasih telah menggunakan Cinema 23.');
        // Here you would typically redirect to login page
        // For demo purposes, we'll just refresh the page
        location.reload();
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('movieModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Keyboard navigation
document.addEventListener('keydown', function (event) {
    const modal = document.getElementById('movieModal');
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Auto-slide functionality (optional)
function startAutoSlide() {
    setInterval(() => {
        // Auto slide latest movies
        slideMovies('latest-movies', 1);

        // Reset to beginning when reaching end
        setTimeout(() => {
            if (currentSlideIndex.latest >= movies.latest.length - 4) {
                currentSlideIndex.latest = 0;
                const slider = document.querySelector('#latest-movies .movie-slider');
                slider.style.transform = 'translateX(0px)';
            }
        }, 100);
    }, 5000);
}

// Touch/swipe support for mobile
function addTouchSupport() {
    const sliders = document.querySelectorAll('.movie-slider');

    sliders.forEach(slider => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            e.preventDefault();
        });

        slider.addEventListener('touchend', () => {
            if (!isDragging) return;

            const diffX = startX - currentX;
            const threshold = 50;

            if (Math.abs(diffX) > threshold) {
                const containerId = slider.parentElement.id;
                const direction = diffX > 0 ? 1 : -1;
                slideMovies(containerId, direction);
            }

            isDragging = false;
        });
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function () {
    init();
    setupSearch();
    addTouchSupport();
    // Uncomment the line below if you want auto-sliding
    // startAutoSlide();

    // Set home as active page initially
    showPage('home')
    if (window.location.pathname.includes("movie-detail.html")) {
        loadMovieDetail();
    }
    ;
});

// Smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                ">
                    <div style="
                        width: 50px;
                        height: 50px;
                        border: 3px solid rgba(229, 9, 20, 0.3);
                        border-top: 3px solid #e50914;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
    document.body.appendChild(loading);

    setTimeout(() => {
        document.body.removeChild(loading);
    }, 1000);
}

// Enhanced error handling
window.addEventListener('error', function (e) {
    console.error('Error occurred:', e.error);
});

// Performance optimization - lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading when needed
// lazyLoadImages();