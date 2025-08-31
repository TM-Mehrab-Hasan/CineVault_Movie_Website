/*
================================
--- Modern Animations & Interactions ---
================================
*/

// Initialize all modern features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollProgress();
    initRevealAnimations();
    initModernInteractions();
    initParticleBackground();
});

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
    });
}

// Reveal animations on scroll
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
}

// Modern interactions and effects
function initModernInteractions() {
    // Enhanced search input interactions
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('search-focus');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('search-focus');
        });
    }
    
    // Enhanced video card interactions
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('modern-hover');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('modern-hover');
        });
    });
    
    // Staggered animation for cards
    const observeCards = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-cards');
                }, index * 100);
                observeCards.unobserve(entry.target);
            }
        });
    });
    
    videoItems.forEach(card => {
        observeCards.observe(card);
    });
    
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.watch-now-button, .download-button, .ep-nav-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('modern-button');
        });
    });
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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
}

// Particle background effect
function initParticleBackground() {
    const particleCount = 15;
    const body = document.body;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 4px and 12px
        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random position
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 8 + 's';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        body.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                createParticle();
            }
        }, 8000);
    }
}

// Enhanced loading states
function showModernLoader() {
    const loader = document.createElement('div');
    loader.className = 'modern-loader';
    loader.style.position = 'fixed';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.zIndex = '9999';
    
    document.body.appendChild(loader);
    return loader;
}

function hideModernLoader(loader) {
    if (loader && loader.parentNode) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.parentNode.removeChild(loader);
        }, 300);
    }
}

// Modern notification system
function showModernNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-modern ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '12px';
    notification.style.color = 'white';
    notification.style.fontWeight = '500';
    notification.style.zIndex = '10000';
    notification.style.maxWidth = '300px';
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// Enhanced category title animations
document.addEventListener('DOMContentLoaded', function() {
    const categoryTitles = document.querySelectorAll('.category-row-title');
    categoryTitles.forEach(title => {
        title.classList.add('category-title');
        
        title.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        title.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Keyboard shortcuts for better UX
document.addEventListener('keydown', function(e) {
    // Focus search with '/' key
    if (e.key === '/' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput === document.activeElement) {
            searchInput.blur();
            searchInput.value = '';
            // Trigger search clear if there's a function for it
            if (typeof clearSearch === 'function') {
                clearSearch();
            }
        }
    }
});

// Enhanced mobile touch interactions
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        const target = e.target.closest('.video-item');
        if (target) {
            target.style.transform = 'scale(0.98)';
        }
    });
    
    document.addEventListener('touchend', function(e) {
        const target = e.target.closest('.video-item');
        if (target) {
            setTimeout(() => {
                target.style.transform = '';
            }, 150);
        }
    });
}

// Performance optimization: Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize any size-dependent features
        initParticleBackground();
    }, 250);
});

// Export functions for use in other scripts
window.ModernAnimations = {
    showLoader: showModernLoader,
    hideLoader: hideModernLoader,
    showNotification: showModernNotification
};
