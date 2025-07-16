document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const videoGrid = document.getElementById('video-grid');
    const searchInput = document.getElementById('searchInput');
    const categoryLinks = document.querySelectorAll('.category-link');
    const categoryTitle = document.getElementById('category-title');
    const loader = document.getElementById('loader');
    const apiKey = '60f2fb19';

    // --- Core Functions ---
    const createPageUrl = (localVideo) => `details.html?id=${encodeURIComponent(localVideo.id)}`;

    const displayVideos = (videoArray) => {
        videoGrid.innerHTML = '';
        if (loader) loader.style.display = 'block';

        if (!videoArray || videoArray.length === 0) {
            if (loader) loader.style.display = 'none';
            videoGrid.innerHTML = '<p style="color: white;">No results found.</p>';
            return;
        }

        const promises = videoArray.map(localVideo => {
            if (!localVideo || !localVideo.imdb_id) return Promise.resolve(null);
            return fetch(`https://www.omdbapi.com/?i=${localVideo.imdb_id}&apikey=${apiKey}`)
                .then(response => response.json())
                .then(apiData => ({ ...localVideo, ...apiData }));
        });

        Promise.all(promises).then(fullDataArray => {
            const validItems = fullDataArray.filter(item => item && item.Response === "True");
            validItems.sort((a, b) => a.Title.localeCompare(b.Title));

            validItems.forEach(item => {
                // --- THIS IS THE UPDATED SECTION WITH ICON LOGIC ---
                let iconHtml = '';
                switch (item.type) {
                    case 'movie':
                        iconHtml = '<i class="fa-solid fa-film"></i>';
                        break;
                    case 'drama':
                        iconHtml = '<i class="fa-solid fa-masks-theater"></i>';
                        break;
                    case 'anime':
                        iconHtml = '<i class="fa-solid fa-dragon"></i>';
                        break;
                }

                const pageUrl = createPageUrl(item);
                const videoItem = document.createElement('a');
                videoItem.href = pageUrl;
                videoItem.classList.add('video-item');
                
                // The iconHtml variable is now added before the title
                videoItem.innerHTML = `
                    <div class="poster-container">
                        <img src="${item.Poster}" alt="${item.Title}">
                        <div class="badge">${item.type}</div>
                    </div>
                    <h3>${iconHtml} ${item.Title}</h3>
                `;
                videoGrid.appendChild(videoItem);
            });

            if (loader) loader.style.display = 'none';
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

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
});
