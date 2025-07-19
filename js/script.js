document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const searchInput = document.getElementById('searchInput');
    const homepageContent = document.getElementById('homepage-content');
    const singleCategoryContent = document.getElementById('single-category-content');
    const singleVideoGrid = document.getElementById('single-video-grid');
    const singleCategoryTitle = document.getElementById('category-title');
    const loader = document.getElementById('loader');
    const apiKey = '60f2fb19';

    let allEnrichedMedia = [];

    // --- Core Functions ---
    const createPageUrl = (item) => {
        const page = (item.type === 'software' || item.type === 'game') ? 'software_details.html' : 'details.html';
        return `${page}?id=${encodeURIComponent(item.id)}`;
    };

    const renderGrid = (gridElement, items) => {
        gridElement.innerHTML = '';
        if (items.length === 0) {
            gridElement.innerHTML = '<p style="color: white; padding-left: 1rem;">No results found.</p>';
            return;
        }
        items.forEach(item => {
            const pageUrl = createPageUrl(item);
            const videoItem = document.createElement('a');
            videoItem.href = pageUrl;
            videoItem.classList.add('video-item');
            videoItem.innerHTML = `<div class="poster-container"><img src="${item.Poster}" alt="${item.Title}"><div class="badge">${item.subcategory || item.type}</div></div><h3>${item.Title}</h3>`;
            gridElement.appendChild(videoItem);
        });
    };

    const showHomepageView = () => {
        homepageContent.style.display = 'block';
        singleCategoryContent.style.display = 'none';

        ['movie', 'drama', 'anime', 'software', 'game'].forEach(type => {
            const grid = document.getElementById(`${type}-grid`);
            if (grid) {
                const filtered = allEnrichedMedia.filter(v => v.type === type);
                filtered.sort((a, b) => a.Title.localeCompare(b.Title));
                const limited = filtered.slice(0, 10);
                renderGrid(grid, limited);
            }
        });
    };

    const showSingleCategoryView = (title, items) => {
        homepageContent.style.display = 'none';
        singleCategoryContent.style.display = 'block';
        singleCategoryTitle.textContent = title;
        items.sort((a, b) => a.Title.localeCompare(b.Title));
        renderGrid(singleVideoGrid, items);
    };

    const initializeEventListeners = () => {
        const allCategoryLinks = document.querySelectorAll('.category-link');
        
        allCategoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.getAttribute('data-category');
                
                // --- THIS IS THE CORRECTED LOGIC ---
                // It creates a clean title (e.g., "Movie") from the data attribute
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                
                searchInput.value = '';

                allCategoryLinks.forEach(l => l.classList.remove('active'));
                const parentLink = e.currentTarget.closest('.dropdown') ? e.currentTarget.closest('.dropdown').querySelector('a') : e.currentTarget;
                
                const navLinkToActivate = document.querySelector(`nav a[data-category="${category}"]`) || parentLink;
                if(navLinkToActivate) {
                    const topLevelDropdown = navLinkToActivate.closest('.dropdown');
                    if(topLevelDropdown) {
                        topLevelDropdown.querySelector('a').classList.add('active');
                    } else {
                        navLinkToActivate.classList.add('active');
                    }
                }

                if (category === 'all') {
                    showHomepageView();
                } else {
                    const filtered = allEnrichedMedia.filter(v => v.type === category || v.subcategory === category);
                    showSingleCategoryView(categoryName, filtered);
                }
            });
        });

        searchInput.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length === 0) {
                showHomepageView();
                return;
            }
            const searchResults = allEnrichedMedia.filter(item =>
                item.Title && item.Title.toLowerCase().includes(searchTerm)
            );
            showSingleCategoryView(`Search results for "${searchTerm}"`, searchResults);
        });

        // Mobile Nav Toggle
        const navToggle = document.querySelector('.nav-toggle');
        const mainNav = document.querySelector('nav');
        if (navToggle && mainNav) {
            navToggle.addEventListener('click', () => {
                mainNav.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    };

    // --- Main App Initialization ---
    if (loader) loader.style.display = 'block';

    const promises = videos.map(localItem => {
        if (localItem.imdb_id) {
            return fetch(`https://www.omdbapi.com/?i=${localItem.imdb_id}&apikey=${apiKey}`)
                .then(res => res.json())
                .then(apiData => ({ ...localItem, ...apiData, Title: apiData.Title, Poster: apiData.Poster }));
        }
        return Promise.resolve({ ...localItem, Title: localItem.title, Poster: localItem.thumbnail });
    });

    Promise.all(promises).then(results => {
        allEnrichedMedia = results.filter(item => item && (item.Response === "True" || item.title));
        
        if (loader) loader.style.display = 'none';
        showHomepageView();
        initializeEventListeners();
    });
});
