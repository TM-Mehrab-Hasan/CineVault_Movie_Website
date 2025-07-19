document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Nav Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('nav');
    const searchContainer = document.querySelector('.search-container');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            navToggle.classList.toggle('active');
            // Close search if nav is opened
            if(searchContainer) searchContainer.classList.remove('active');
        });
    }

    // --- Mobile Search Toggle ---
    const searchToggleBtn = document.querySelector('.search-toggle-btn');
    const searchInput = document.getElementById('searchInput');

    if (searchToggleBtn && searchContainer) {
        searchToggleBtn.addEventListener('click', () => {
            searchContainer.classList.toggle('active');
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
            }
            if (searchContainer.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }
    
    // --- Logic for Search on Sub-Pages ---
    // If we are on a page that is NOT the homepage, pressing Enter in the search
    // will redirect the user to the homepage with their search query.
    if (searchInput && !window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
         searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                window.location.href = `index.html?search=${encodeURIComponent(searchInput.value)}`;
            }
        });
    }
});
