/**
 * Utility functions for CinemaVault
 */

class CineVaultUtils {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.createBackToTopButton();
        this.setupNotificationSystem();
        this.setupPerformanceOptimizations();
    }

    // Notification System
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    setupNotificationSystem() {
        // Listen for watchlist changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'cineVaultWatchlist') {
                this.showNotification('Watchlist updated!', 'success');
            }
        });
    }

    // Back to Top Button
    createBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.title = 'Back to Top';
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.body.appendChild(backToTopBtn);

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Debounce search
        this.debounceSearch();
        
        // Cache API responses
        this.setupAPICache();
    }

    setupLazyLoading() {
        // Use Intersection Observer for better performance
        if ('IntersectionObserver' in window) {
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

            // Apply to future images
            const observeImages = () => {
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            };

            // Initial observation
            observeImages();

            // Re-observe when new content is added
            const targetNode = document.querySelector('main');
            if (targetNode) {
                const observer = new MutationObserver(observeImages);
                observer.observe(targetNode, { childList: true, subtree: true });
            }
        }
    }

    debounceSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;

        let searchTimeout;
        const originalHandler = searchInput.onkeyup;
        
        searchInput.onkeyup = (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (originalHandler) originalHandler(e);
            }, 300);
        };
    }

    setupAPICache() {
        // Simple memory cache for API responses
        this.apiCache = new Map();
        
        // Override fetch for OMDB API
        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {
            if (url.includes('omdbapi.com')) {
                if (this.apiCache.has(url)) {
                    return Promise.resolve(new Response(
                        JSON.stringify(this.apiCache.get(url))
                    ));
                }

                const response = await originalFetch(url, options);
                const data = await response.json();
                
                // Cache successful responses
                if (data.Response === "True") {
                    this.apiCache.set(url, data);
                }
                
                return Promise.resolve(new Response(JSON.stringify(data)));
            }
            
            return originalFetch(url, options);
        };
    }

    // Loading skeleton helper
    showLoadingSkeleton(container, count = 6) {
        const skeletonGrid = document.createElement('div');
        skeletonGrid.className = 'skeleton-grid';
        
        for (let i = 0; i < count; i++) {
            const skeletonItem = document.createElement('div');
            skeletonItem.className = 'skeleton-item';
            skeletonItem.innerHTML = `
                <div class="skeleton-poster skeleton"></div>
                <div class="skeleton-title skeleton"></div>
            `;
            skeletonGrid.appendChild(skeletonItem);
        }
        
        container.innerHTML = '';
        container.appendChild(skeletonGrid);
    }

    // Error handling
    showErrorState(container, message = 'Something went wrong', retryCallback = null) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Oops!</h3>
                <p>${message}</p>
                ${retryCallback ? '<button class="retry-btn" onclick="retryCallback()">Try Again</button>' : ''}
            </div>
        `;
    }

    // Local storage helpers
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('LocalStorage error:', e);
            return false;
        }
    }

    getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('LocalStorage error:', e);
            return defaultValue;
        }
    }

    // URL helpers
    updateURL(params) {
        const url = new URL(window.location);
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.set(key, params[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.pushState({}, '', url);
    }

    // Format helpers
    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Analytics (privacy-friendly)
    trackEvent(eventName, data = {}) {
        // Only track in production and with user consent
        if (window.location.hostname === 'cinemavault.netlify.app') {
            console.log(`Event: ${eventName}`, data);
            // Here you could integrate with analytics service
        }
    }

    // Theme helpers
    toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark-theme');
        
        if (isDark) {
            body.classList.remove('dark-theme');
            this.setLocalStorage('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            this.setLocalStorage('theme', 'dark');
        }
        
        this.showNotification(`Switched to ${isDark ? 'light' : 'dark'} theme`, 'success');
    }

    // Initialize saved theme
    initTheme() {
        const savedTheme = this.getLocalStorage('theme', 'dark');
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
        }
    }

    // Network status
    setupNetworkDetection() {
        const updateNetworkStatus = () => {
            if (!navigator.onLine) {
                this.showNotification('You are offline. Some features may not work.', 'warning', 5000);
            }
        };

        window.addEventListener('offline', updateNetworkStatus);
        window.addEventListener('online', () => {
            this.showNotification('Back online!', 'success');
        });
    }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Search: Ctrl/Cmd + K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Home: Ctrl/Cmd + H
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                window.location.href = '/';
            }
            
            // Toggle theme: Ctrl/Cmd + Shift + T
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
}

// Initialize utilities
document.addEventListener('DOMContentLoaded', () => {
    window.cineVaultUtils = new CineVaultUtils();
    window.cineVaultUtils.initTheme();
    window.cineVaultUtils.setupNetworkDetection();
    window.cineVaultUtils.setupKeyboardShortcuts();
});
