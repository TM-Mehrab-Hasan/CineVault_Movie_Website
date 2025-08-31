document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const categoryLinks = document.querySelectorAll('.category-link');
    const homepageContent = document.getElementById('homepage-content');
    const singleCategoryContent = document.getElementById('single-category-content');
    const singleVideoGrid = document.getElementById('single-video-grid');
    const singleCategoryTitle = document.getElementById('category-title');
    const loader = document.getElementById('loader');
    const apiKey = '60f2fb19';

    // Filter elements
    const genreFilter = document.getElementById('genreFilter');
    const yearFilter = document.getElementById('yearFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortSelect = document.getElementById('sortSelect');
    const searchFilters = document.getElementById('searchFilters');
    
    // View toggle elements
    const viewButtons = document.querySelectorAll('.view-btn');

    let allEnrichedMedia = [];
    let currentView = 'grid';
    let watchlist = JSON.parse(localStorage.getItem('cineVaultWatchlist') || '[]');

    // Show search filters when typing
    if (searchInput && searchFilters) {
        searchInput.addEventListener('focus', () => {
            searchFilters.classList.add('active');
        });
        
        searchInput.addEventListener('blur', (e) => {
            // Don't hide if clicking on filter
            setTimeout(() => {
                if (!e.relatedTarget || !searchFilters.contains(e.relatedTarget)) {
                    searchFilters.classList.remove('active');
                }
            }, 200);
        });
    }

    const createPageUrl = (item) => {
        const page = (item.type === 'software' || item.type === 'game') ? 'software_details.html' : 'details.html';
        return `${page}?id=${encodeURIComponent(item.id)}`;
    };

    const addToWatchlist = (itemId) => {
        if (!watchlist.includes(itemId)) {
            watchlist.push(itemId);
            localStorage.setItem('cineVaultWatchlist', JSON.stringify(watchlist));
        }
    };

    const removeFromWatchlist = (itemId) => {
        watchlist = watchlist.filter(id => id !== itemId);
        localStorage.setItem('cineVaultWatchlist', JSON.stringify(watchlist));
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
            
            const isInWatchlist = watchlist.includes(item.id);
            const rating = item.imdbRating && item.imdbRating !== 'N/A' ? item.imdbRating : '';
            const year = item.Year || '';
            
            videoItem.innerHTML = `
                <div class="poster-container">
                    <img src="${item.Poster}" alt="${item.Title}">
                    <div class="badge">${item.subcategory || item.type}</div>
                    ${rating ? `<div class="rating-display">⭐ ${rating}</div>` : ''}
                    <button class="watchlist-btn ${isInWatchlist ? 'added' : ''}" 
                            onclick="event.preventDefault(); toggleWatchlist('${item.id}')" 
                            title="${isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}">
                        <i class="fas fa-${isInWatchlist ? 'check' : 'plus'}"></i>
                    </button>
                </div>
                <h3>${item.Title}</h3>
            `;
            gridElement.appendChild(videoItem);
        });

        // Apply current view
        gridElement.className = `video-grid ${currentView === 'list' ? 'list-view' : ''}`;
    };

    // Make toggleWatchlist global
    window.toggleWatchlist = (itemId) => {
        if (watchlist.includes(itemId)) {
            removeFromWatchlist(itemId);
        } else {
            addToWatchlist(itemId);
        }
        // Re-render current view
        const currentCategory = document.querySelector('.category-link.active')?.getAttribute('data-category') || 'all';
        if (currentCategory === 'all') {
            showHomepageView();
        } else {
            const filtered = allEnrichedMedia.filter(v => v.type === currentCategory || v.subcategory === currentCategory);
            showSingleCategoryView(currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1), filtered);
        }
    };

    const sortItems = (items, sortBy) => {
        return items.sort((a, b) => {
            switch (sortBy) {
                case 'year':
                    return (b.Year || '0').localeCompare(a.Year || '0');
                case 'rating':
                    const ratingA = parseFloat(a.imdbRating) || 0;
                    const ratingB = parseFloat(b.imdbRating) || 0;
                    return ratingB - ratingA;
                case 'genre':
                    return (a.Genre || '').localeCompare(b.Genre || '');
                case 'title':
                default:
                    return a.Title.localeCompare(b.Title);
            }
        });
    };

    const filterItems = (items) => {
        let filtered = [...items];
        
        const genre = genreFilter?.value;
        const year = yearFilter?.value;
        const rating = ratingFilter?.value;
        
        if (genre) {
            filtered = filtered.filter(item => 
                item.Genre && item.Genre.toLowerCase().includes(genre.toLowerCase())
            );
        }
        
        if (year) {
            filtered = filtered.filter(item => item.Year === year);
        }
        
        if (rating) {
            filtered = filtered.filter(item => 
                item.imdbRating && parseFloat(item.imdbRating) >= parseFloat(rating)
            );
        }
        
        return filtered;
    };

    const getRecentlyAdded = (items, count = 6) => {
        // Sort by a mock date - in real app, you'd have actual upload dates
        const itemsWithDate = items.map(item => ({
            ...item,
            mockDate: Math.random() // Mock recent date for demo
        }));
        return itemsWithDate.sort((a, b) => b.mockDate - a.mockDate).slice(0, count);
    };

    const getTrending = (items, count = 6) => {
        // Mock trending based on rating and year
        return items
            .filter(item => item.imdbRating && parseFloat(item.imdbRating) > 7)
            .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
            .slice(0, count);
    };

    const showHomepageView = () => {
        homepageContent.style.display = 'block';
        singleCategoryContent.style.display = 'none';
        
        // Trending section
        const trendingGrid = document.getElementById('trending-grid');
        if (trendingGrid) {
            const trending = getTrending(allEnrichedMedia);
            renderGrid(trendingGrid, trending);
        }
        
        // Recently added section
        const recentGrid = document.getElementById('recent-grid');
        if (recentGrid) {
            const recent = getRecentlyAdded(allEnrichedMedia);
            renderGrid(recentGrid, recent);
        }
        
        // Regular category sections
        ['movie', 'drama', 'anime', 'software', 'game'].forEach(type => {
            const grid = document.getElementById(`${type}-grid`);
            if (grid) {
                const filtered = allEnrichedMedia.filter(v => v.type === type);
                const sorted = sortItems(filtered, 'title'); // Sort alphabetically by title
                const limited = sorted.slice(0, 10);
                renderGrid(grid, limited);
            }
        });
    };

    const showSingleCategoryView = (title, items) => {
        homepageContent.style.display = 'none';
        singleCategoryContent.style.display = 'block';
        singleCategoryTitle.textContent = title;
        
        let processedItems = filterItems(items);
        const sortBy = sortSelect?.value || 'title';
        processedItems = sortItems(processedItems, sortBy);
        
        renderGrid(singleVideoGrid, processedItems);
    };

    const initializeEventListeners = () => {
        // Category links
        const allCategoryLinks = document.querySelectorAll('.category-link');
        allCategoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.getAttribute('data-category');
                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                searchInput.value = '';
                allCategoryLinks.forEach(l => l.classList.remove('active'));
                
                const navLinkToActivate = document.querySelector(`nav a[data-category="${category}"]`);
                if(navLinkToActivate) {
                    const parentDropdown = navLinkToActivate.closest('.dropdown');
                    if(parentDropdown) { 
                        parentDropdown.querySelector('a').classList.add('active'); 
                    } else { 
                        navLinkToActivate.classList.add('active'); 
                    }
                }
                
                if (category === 'all') { 
                    showHomepageView(); 
                } else if (category === 'recent') {
                    const recent = getRecentlyAdded(allEnrichedMedia, 20);
                    showSingleCategoryView('Recently Added', recent);
                } else if (category === 'watchlist') {
                    const watchlistItems = allEnrichedMedia.filter(item => watchlist.includes(item.id));
                    showSingleCategoryView('My Watchlist', watchlistItems);
                } else {
                    const filtered = allEnrichedMedia.filter(v => v.type === category || v.subcategory === category);
                    showSingleCategoryView(categoryName, filtered);
                }
            });
        });

        // Search functionality
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

        // Filter change handlers
        [genreFilter, yearFilter, ratingFilter].forEach(filter => {
            filter?.addEventListener('change', () => {
                const currentCategory = document.querySelector('.category-link.active')?.getAttribute('data-category') || 'all';
                if (currentCategory !== 'all') {
                    const filtered = allEnrichedMedia.filter(v => v.type === currentCategory || v.subcategory === currentCategory);
                    showSingleCategoryView(currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1), filtered);
                }
            });
        });

        // Sort change handler
        sortSelect?.addEventListener('change', () => {
            const currentCategory = document.querySelector('.category-link.active')?.getAttribute('data-category') || 'all';
            if (currentCategory !== 'all') {
                const filtered = allEnrichedMedia.filter(v => v.type === currentCategory || v.subcategory === currentCategory);
                showSingleCategoryView(currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1), filtered);
            }
        });

        // View toggle handlers
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentView = btn.getAttribute('data-view');
                
                // Re-render current grid with new view
                const currentGrid = singleVideoGrid;
                if (currentGrid && currentGrid.children.length > 0) {
                    currentGrid.className = `video-grid ${currentView === 'list' ? 'list-view' : ''}`;
                }
            });
        });
    };

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
        
        // Check for search query in URL
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearchTerm = urlParams.get('search');
        if (initialSearchTerm) {
            searchInput.value = initialSearchTerm;
            const searchResults = allEnrichedMedia.filter(item => 
                item.Title && item.Title.toLowerCase().includes(initialSearchTerm.toLowerCase())
            );
            showSingleCategoryView(`Search results for "${initialSearchTerm}"`, searchResults);
        } else {
            showHomepageView();
        }
        
        initializeEventListeners();
    });
});
