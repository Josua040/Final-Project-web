let movies = [
    {
        id: 1,
        image: "https://via.placeholder.com/80x120/e94560/ffffff?text=Movie",
        title: "Contoh Film 1",
        description: "Deskripsi film yang menarik dan menghibur...",
        year: 2023,
        rating: 8.5
    }
];
let nextMovieId = 2;
let editingMovieId = null;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    sidebar.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update active menu item
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    menuItems.forEach(item => item.classList.remove('active'));
    event.target.classList.add('active');
    
    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

function openAddMovieModal() {
    document.getElementById('modalTitle').textContent = 'Tambah Film';
    document.getElementById('movieForm').reset();
    editingMovieId = null;
    document.getElementById('movieModal').classList.add('active');
}

function editMovie(id) {
    const movie = movies.find(m => m.id === id);
    if (movie) {
        document.getElementById('modalTitle').textContent = 'Edit Film';
        document.getElementById('movieImage').value = movie.image;
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('movieDescription').value = movie.description;
        document.getElementById('movieYear').value = movie.year;
        document.getElementById('movieRating').value = movie.rating;
        editingMovieId = id;
        document.getElementById('movieModal').classList.add('active');
    }
}

function deleteMovie(id) {
    if (confirm('Apakah Anda yakin ingin menghapus film ini?')) {
        movies = movies.filter(m => m.id !== id);
        renderMoviesTable();
    }
}

function closeModal() {
    document.getElementById('movieModal').classList.remove('active');
}

function renderMoviesTable() {
    const tbody = document.querySelector('#moviesTable tbody');
    tbody.innerHTML = '';
    
    movies.forEach((movie, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${movie.image}" alt="${movie.title}"erste class="movie-img" onerror="this.src='https://via.placeholder.com/80x120/e94560/ffffff?text=No+Image'"></td>
            <td>${movie.title}</td>
            <td>${movie.description}</td>
            <td>${movie.year}</td>
            <td>${movie.rating}</td>
            <td>
                <button class="btn btn-warning" onclick="editMovie(${movie.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteMovie(${movie.id})">Hapus</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        alert('Berhasil logout!');
        // Redirect to login page or reload
        location.reload();
    }
}

// Handle movie form submission
document.getElementById('movieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const movieData = {
        image: formData.get('movieImage') || 'https://via.placeholder.com/80x120/e94560/ffffff?text=No+Image',
        title: formData.get('movieTitle'),
        description: formData.get('movieDescription'),
        year: parseInt(formData.get('movieYear')),
        rating: parseFloat(formData.get('movieRating'))
    };
    
    if (editingMovieId) {
        // Edit existing movie
        const movieIndex = movies.findIndex(m => m.id === editingMovieId);
        if (movieIndex !== -1) {
            movies[movieIndex] = { ...movieData, id: editingMovieId };
        }
    } else {
        // Add new movie
        movieData.id = nextMovieId++;
        movies.push(movieData);
    }
    
    renderMoviesTable();
    closeModal();
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('movieModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close sidebar when clicking outside
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.querySelector('.hamburger');
    
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderMoviesTable();
});