// This function contains all the logic that runs after the video data is loaded
function initializeHomepage(videos) {
    const videoGrid = document.getElementById('video-grid');
    const searchInput = document.getElementById('searchInput');
    const categoryLinks = document.querySelectorAll('.category-link');
    const categoryTitle = document.getElementById('category-title');
    const loader = document.getElementById('loader');
    const apiKey = '60f2fb19';

    const createPageUrl = (localVideo) => `details.html?id=${encodeURIComponent(localVideo.id)}`;

    const displayVideos = (videoArray) => {
        videoGrid.innerHTML = '';
        if (loader) loader.style.display = 'block';

        if (!videoArray || videoArray.length === 0) {
            videoGrid.innerHTML = '<p style="color: white;">No results found.</p>';
            if (loader) loader.style.display = 'none';
            return;
        }

        const promises = videoArray.map(localVideo => {
            if (!localVideo || !localVideo.imdb_id) return Promise.resolve();
            return fetch(`https://www.omdbapi.com/?i=${localVideo.imdb_id}&apikey=${apiKey}`)
                .then(response => response.json())
                .then(apiData => {
                    if (apiData.Response === "True") {
                        const pageUrl = createPageUrl(localVideo);
                        const videoItem = document.createElement('a');
                        videoItem.href = pageUrl;
                        videoItem.classList.add('video-item');
                        videoItem.innerHTML = `<img src="${apiData.Poster}" alt="${apiData.Title}"><h3>${apiData.Title}</h3>`;
                        videoGrid.appendChild(videoItem);
                    }
                })
                .catch(error => console.error('Error fetching grid data:', error));
        });

        Promise.allSettled(promises).then(() => {
            if (loader) loader.style.display = 'none';
        });
    };

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
}

// Fetch the video data from the JSON file first, then start the homepage logic
document.addEventListener('DOMContentLoaded', () => {
    fetch('js/videos.json')
        .then(response => response.json())
        .then(data => initializeHomepage(data))
        .catch(error => console.error('Error loading videos.json:', error));
});