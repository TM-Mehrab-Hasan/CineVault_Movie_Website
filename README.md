# CinemaVault Website 🎬

Your ultimate cinema universe for movies, dramas, anime, software and games. Built with vanilla HTML, CSS, and JavaScript.

You can watch it live - "https://cinemavault.netlify.app/"

## 🌟 Features

### ✅ Current Features
- **Responsive Design** - Works on all devices
- **Smart Search** - Search across all content with filters
- **Category Browsing** - Movies, Drama, Anime, Software, Games
- **OMDB Integration** - Automatic movie metadata fetching
- **Google Drive Streaming** - Direct video playback
- **Trending & Recently Added** - Dynamic content sections
- **Watchlist** - Save favorites locally
- **PWA Support** - Install as mobile app
- **Content Management** - Easy content addition tool
- **Performance Optimized** - Fast loading with caching

### 🆕 New Enhancements
- **Advanced Filtering** - Filter by genre, year, rating
- **Multiple View Modes** - Grid and list views
- **Smart Notifications** - User feedback system
- **Keyboard Shortcuts** - Power user features
- **Offline Support** - Works without internet
- **Loading Skeletons** - Better user experience
- **Error Handling** - Graceful failure handling

## 🛠️ Easy Content Management

### Using the Built-in Content Manager
1. Open your website locally (`localhost` or `127.0.0.1`)
2. Click the ⚙️ button in the bottom-right corner
3. Search for movies/shows by title
4. Enter Google Drive ID or URL
5. Select category and subcategory
6. Click "Generate Code" to get the JSON
7. Copy the generated code to `videos.js`

### Manual Content Addition

#### For Movies:
```javascript
{
    "id": "movie-title-year",
    "type": "movie",
    "subcategory": "Hollywood", // Bollywood, Korean Movie, etc.
    "imdb_id": "tt1234567",
    "google_drive_id": "your-google-drive-id"
}
```

#### For TV Series/Anime:
```javascript
{
    "id": "series-name",
    "type": "drama", // or "anime"
    "subcategory": "Korean Drama",
    "imdb_id": "tt1234567",
    "seasons": [
        {
            "season_title": "Season 1",
            "episodes": [
                {
                    "title": "Episode 1 Title",
                    "google_drive_id": "episode-drive-id"
                }
            ]
        }
    ]
}
```

#### For Software/Games:
```javascript
{
    "id": "software-name",
    "type": "software", // or "game"
    "title": "Software Name",
    "description": "Description here",
    "thumbnail": "image-url",
    "download_all_id": "main-download-id",
    "files": [
        {
            "name": "filename.exe",
            "size": "100 MB",
            "google_drive_id": "file-drive-id"
        }
    ]
}
```

## 🎯 Getting Google Drive IDs

### Method 1: Share Link
1. Right-click your file/folder in Google Drive
2. Click "Get link" → "Anyone with the link"
3. Copy the ID from the URL: `https://drive.google.com/file/d/YOUR_ID_HERE/view`

### Method 2: Direct URL
- File: `https://drive.google.com/file/d/FILE_ID/view`
- Folder: `https://drive.google.com/drive/folders/FOLDER_ID`

## 📱 PWA Installation

Your website can now be installed as a mobile app:
1. Open the website on mobile
2. Look for "Add to Home Screen" prompt
3. Or use browser menu → "Install App"

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --color-primary: #e50914; /* Your brand color */
    --color-background: #101418;
    --color-surface: #191E24;
    /* ... other colors */
}
```

### Adding New Categories
1. Add to navigation in `index.html`
2. Update the filter arrays in `js/script.js`
3. Add corresponding sections

### Modifying Layout
- Homepage sections: Edit `index.html` main content
- Grid layout: Modify CSS grid properties
- Mobile responsiveness: Adjust `@media` queries

## 🚀 Performance Tips

### Optimizing Images
- Use WebP format when possible
- Compress poster images
- Use appropriate dimensions (300x450px for posters)

### Managing Large Libraries
- Consider pagination for 1000+ items
- Implement search debouncing (already included)
- Use virtual scrolling for massive lists

### CDN Integration
Replace Google Drive with CDN for better performance:
```javascript
// Instead of Google Drive ID
"stream_url": "https://your-cdn.com/video.mp4"
```

## 🔧 Maintenance

### Regular Updates
1. **Update OMDB API Key**: Replace in `js/script.js` if needed
2. **Monitor Error Console**: Check for API failures
3. **Update PWA Cache**: Increment version in `sw.js`
4. **Clean Old Content**: Remove outdated entries

### Backup Strategy
1. **Export Videos.js**: Regular backups of your content
2. **Database Export**: Consider migrating to JSON file or database
3. **Drive Organization**: Keep organized folder structure

### SEO Optimization
- Update meta descriptions for new content
- Add structured data markup
- Optimize images with alt texts
- Create sitemap.xml

## 🛡️ Security & Legal

### Content Guidelines
- Ensure you have rights to host content
- Use proper content warnings/ratings
- Implement age verification if needed
- Follow copyright laws

### User Privacy
- Local storage only (no tracking)
- No personal data collection
- Optional analytics with consent

## 📊 Analytics Setup

Add privacy-friendly analytics:
```javascript
// In utils.js trackEvent function
if (userConsent && window.location.hostname === 'your-domain.com') {
    // Your analytics code
}
```

## 🤝 Contributing

### Adding Features
1. Create feature branch
2. Test locally
3. Update documentation
4. Submit pull request

### Bug Reports
- Include browser and device info
- Provide steps to reproduce
- Include console errors

## 📞 Support

- **Issues**: Create GitHub issue
- **Features**: Open discussion
- **Questions**: Check documentation first

## 🎖️ Credits

- **OMDB API**: Movie metadata
- **Font Awesome**: Icons
- **Google Fonts**: Typography
- **Netlify**: Hosting platform

---

**Happy Watching! 🍿**

Made with ❤️ for cinema lovers everywhere.

