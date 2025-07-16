document.addEventListener('DOMContentLoaded', () => {
    const videoGrid = document.getElementById('video-grid');
    const searchInput = document.getElementById('searchInput');
    const categoryLinks = document.querySelectorAll('.category-link');
    const categoryTitle = document.getElementById('category-title');
    const loader = document.getElementById('loader');
    const apiKey = '60f2fb19';

    // This function creates the link to the details page
    const createPageUrl = (localVideo) => `details.html?id=${encodeURIComponent(localVideo.id)}`;

    // --- `displayVideos` function with sorting logic ---
    const displayVideos = (videoArray) => {
        videoGrid.innerHTML = '';
        if (loader) loader.style.display = 'block';

        if (!videoArray || videoArray.length === 0) {
            if (loader) loader.style.display = 'none';
            videoGrid.innerHTML = '<p style="color: white;">No results found.</p>';
            return;
        }

        // 1. Create an array of promises to fetch data for all items
        const promises = videoArray.map(localVideo => {
            if (!localVideo || !localVideo.imdb_id) return Promise.resolve(null);
            return fetch(`https://www.omdbapi.com/?i=${localVideo.imdb_id}&apikey=${apiKey}`)
                .then(response => response.json())
                .then(apiData => {
                    return { ...localVideo, ...apiData }; // Combine local and API data
                });
        });

        // 2. Wait for all fetches to complete
        Promise.all(promises).then(fullDataArray => {
            const validItems = fullDataArray.filter(item => item && item.Response === "True");

            // 3. Sort the array of items alphabetically by title
            validItems.sort((a, b) => a.Title.localeCompare(b.Title));

            // 4. Now, display the sorted items
            validItems.forEach(item => {
                const pageUrl = createPageUrl(item);
                const videoItem = document.createElement('a');
                videoItem.href = pageUrl;
                videoItem.classList.add('video-item');
                videoItem.innerHTML = `<img src="${item.Poster}" alt="${item.Title}"><h3>${item.Title}</h3>`;
                videoGrid.appendChild(videoItem);
            });

            if (loader) loader.style.display = 'none'; // Hide loader after displaying
        });
    };

    // --- Event Listeners ---

    displayVideos(videos);

    searchInput.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        document.querySelectorAll('.video-item').forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            item.style.display = title.includes(searchTerm) ? 'block' : 'none';
        });
    });

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            searchInput.value = '';
            
            // This logic correctly handles highlighting for dropdowns
            categoryLinks.forEach(l => l.classList.remove('active'));
            if (e.currentTarget.parentElement.classList.contains('dropdown-content')) {
                e.currentTarget.parentElement.previousElementSibling.classList.add('active');
            } else {
                e.currentTarget.classList.add('active');
            }

            let filteredVideos = (category === 'all') ? videos : videos.filter(v => v.type === category || v.subcategory === category);
            categoryTitle.textContent = (category === 'all') ? 'All Content' : category.charAt(0).toUpperCase() + category.slice(1);
            displayVideos(filteredVideos);
        });
    });

    // --- NEW: Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('nav'); // Selects the main <nav> element

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            // Toggles the 'active' class on the nav menu and the button itself
            mainNav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
});