/**
 * Content Management System for CinemaVault
 * This helps automate content updates
 */

class ContentManager {
    constructor() {
        this.apiKey = '60f2fb19';
        this.baseUrl = 'https://www.omdbapi.com/';
    }

    /**
     * Search for movies/shows by title and get IMDB ID
     */
    async searchByTitle(title, type = '') {
        try {
            const response = await fetch(`${this.baseUrl}?s=${encodeURIComponent(title)}&type=${type}&apikey=${this.apiKey}`);
            const data = await response.json();
            
            if (data.Response === "True") {
                return data.Search;
            }
            return [];
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    /**
     * Get detailed movie info by IMDB ID
     */
    async getMovieDetails(imdbId) {
        try {
            const response = await fetch(`${this.baseUrl}?i=${imdbId}&apikey=${this.apiKey}`);
            const data = await response.json();
            return data.Response === "True" ? data : null;
        } catch (error) {
            console.error('Details error:', error);
            return null;
        }
    }

    /**
     * Generate video object template for easy copy-paste
     */
    generateVideoTemplate(movieData, driveId, category, subcategory) {
        const template = {
            id: this.generateId(movieData.Title),
            type: category.toLowerCase(),
            subcategory: subcategory,
            imdb_id: movieData.imdbID,
            google_drive_id: driveId
        };

        return JSON.stringify(template, null, 2);
    }

    /**
     * Generate series template
     */
    generateSeriesTemplate(movieData, episodes, category, subcategory) {
        const template = {
            id: this.generateId(movieData.Title),
            type: category.toLowerCase(),
            subcategory: subcategory,
            imdb_id: movieData.imdbID,
            seasons: [
                {
                    season_title: "Season 1",
                    episodes: episodes.map((ep, index) => ({
                        title: ep.title || `Episode ${index + 1}`,
                        google_drive_id: ep.driveId
                    }))
                }
            ]
        };

        return JSON.stringify(template, null, 2);
    }

    /**
     * Generate ID from title
     */
    generateId(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }

    /**
     * Validate Google Drive ID format
     */
    isValidDriveId(id) {
        return /^[a-zA-Z0-9_-]{25,}$/.test(id);
    }

    /**
     * Extract Drive ID from various Google Drive URL formats
     */
    extractDriveId(url) {
        const patterns = [
            /\/d\/([a-zA-Z0-9_-]+)/,  // /d/ID
            /id=([a-zA-Z0-9_-]+)/,    // ?id=ID
            /\/file\/d\/([a-zA-Z0-9_-]+)/  // /file/d/ID
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }
}

// Content Management UI Helper
class ContentManagerUI {
    constructor() {
        this.manager = new ContentManager();
        this.createUI();
    }

    createUI() {
        // Create floating admin panel (only visible in development)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.createAdminPanel();
        }
    }

    createAdminPanel() {
        const panel = document.createElement('div');
        panel.id = 'admin-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background: #1a1f26;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 15px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 10000;
            display: none;
        `;

        panel.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #e50914;">Content Manager</h4>
            <div style="margin-bottom: 10px;">
                <input type="text" id="search-title" placeholder="Search title..." style="width: 100%; padding: 5px; margin-bottom: 5px;">
                <button id="search-btn" style="padding: 5px 10px; background: #e50914; color: white; border: none; cursor: pointer;">Search</button>
            </div>
            <div id="search-results" style="max-height: 200px; overflow-y: auto;"></div>
            <div style="margin-top: 10px;">
                <input type="text" id="drive-id" placeholder="Google Drive ID/URL..." style="width: 100%; padding: 5px; margin-bottom: 5px;">
                <select id="category" style="width: 48%; padding: 5px; margin-right: 2%;">
                    <option value="movie">Movie</option>
                    <option value="drama">Drama</option>
                    <option value="anime">Anime</option>
                </select>
                <select id="subcategory" style="width: 48%; padding: 5px;">
                    <option value="Hollywood">Hollywood</option>
                    <option value="Bollywood">Bollywood</option>
                    <option value="Korean Movie">Korean</option>
                    <option value="Korean Drama">Korean Drama</option>
                    <option value="Chinese Drama">Chinese Drama</option>
                    <option value="Japanese Anime">Japanese Anime</option>
                </select>
            </div>
            <button id="generate-btn" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; cursor: pointer; margin-top: 10px;">Generate Code</button>
            <textarea id="output" style="width: 100%; height: 100px; margin-top: 10px; font-family: monospace; font-size: 10px;" readonly></textarea>
        `;

        document.body.appendChild(panel);

        // Add toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '⚙️';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #e50914;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 10001;
            font-size: 20px;
        `;
        
        toggleBtn.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        document.body.appendChild(toggleBtn);

        this.attachEventListeners(panel);
    }

    attachEventListeners(panel) {
        const searchBtn = panel.querySelector('#search-btn');
        const generateBtn = panel.querySelector('#generate-btn');
        const searchTitle = panel.querySelector('#search-title');
        const searchResults = panel.querySelector('#search-results');
        const output = panel.querySelector('#output');

        let selectedMovie = null;

        searchBtn.addEventListener('click', async () => {
            const title = searchTitle.value.trim();
            if (!title) return;

            searchResults.innerHTML = 'Searching...';
            const results = await this.manager.searchByTitle(title);
            
            if (results.length === 0) {
                searchResults.innerHTML = 'No results found';
                return;
            }

            searchResults.innerHTML = results.map(movie => `
                <div style="padding: 5px; border: 1px solid #444; margin: 2px; cursor: pointer; ${selectedMovie?.imdbID === movie.imdbID ? 'background: #333;' : ''}" 
                     onclick="selectMovie('${movie.imdbID}', '${movie.Title}', '${movie.Year}')">
                    <strong>${movie.Title}</strong> (${movie.Year})
                </div>
            `).join('');
        });

        // Make selectMovie global
        window.selectMovie = (imdbID, title, year) => {
            selectedMovie = { imdbID, Title: title, Year: year };
            searchResults.querySelectorAll('div').forEach(div => {
                div.style.background = div.onclick.toString().includes(imdbID) ? '#333' : 'transparent';
            });
        };

        generateBtn.addEventListener('click', async () => {
            if (!selectedMovie) {
                alert('Please select a movie first');
                return;
            }

            const driveInput = panel.querySelector('#drive-id').value.trim();
            const category = panel.querySelector('#category').value;
            const subcategory = panel.querySelector('#subcategory').value;

            if (!driveInput) {
                alert('Please enter Google Drive ID or URL');
                return;
            }

            const driveId = this.manager.extractDriveId(driveInput) || driveInput;
            
            if (!this.manager.isValidDriveId(driveId)) {
                alert('Invalid Google Drive ID format');
                return;
            }

            const movieDetails = await this.manager.getMovieDetails(selectedMovie.imdbID);
            if (!movieDetails) {
                alert('Could not fetch movie details');
                return;
            }

            const template = this.manager.generateVideoTemplate(movieDetails, driveId, category, subcategory);
            output.value = template;
            output.select();
            
            // Try to copy to clipboard
            try {
                document.execCommand('copy');
                alert('Code copied to clipboard! Add this to videos.js');
            } catch (e) {
                alert('Code generated! Please copy from the text area below.');
            }
        });
    }
}

// Initialize content manager in development
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContentManagerUI();
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContentManager, ContentManagerUI };
}
