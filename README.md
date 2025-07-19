# MovieSaviour 🎬

MovieSaviour is a dynamic, fully responsive website for Browse and streaming a personal collection of movies, dramas, animes, software, and games. It leverages modern web technologies to provide a seamless user experience, fetching rich metadata from the OMDb API and serving content directly from Google Drive.

---
## 🚀 Live Demo

You can view the live project here: **[https://moviesaviour.netlify.app/](https://moviesaviour.netlify.app/)**

---
## ✨ Key Features

* **Dynamic Content:** Fetches posters, titles, ratings, plots, and more from the OMDb API for movies, dramas, and animes.
* **Multiple Content Types:** Features separate, browsable rows on the homepage for Movies, Dramas, Animes, Software, and Games.
* **Advanced Navigation:** Includes multi-level dropdown menus and a fully responsive "hamburger" menu for mobile.
* **"See all" Functionality:** Homepage rows show a preview of 10 items, with a "See all" button to view the complete category.
* **Details Pages:** Each item has a dedicated page with comprehensive information and a full file/episode list.
* **Enhanced Video Player:** For series, the player page displays a full episode list with highlighting and "Next/Previous" buttons for easy navigation.
* **Functional Search:** A search bar is available on both desktop and mobile to filter all content by title.
* **Polished UI/UX:** Features a professional design with custom fonts, a modern color palette, loading indicators, and smooth hover effects.

---

## 🛠️ Tech Stack

* **Front-End:** HTML5, CSS3 (Flexbox & Grid), and modern JavaScript (ES6+).
* **API:** [The OMDb API](http://www.omdbapi.com/) for fetching metadata.
* **Hosting:** Hosted on [Netlify](https://www.netlify.com/) with continuous deployment from GitHub.

---

## ⚙️ Setup and Installation

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/TMRatul49/MovieSaviour_Website.git](https://github.com/TMRatul49/MovieSaviour_Website.git)
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd MovieSaviour_Website
    ```
3.  **Get an API Key:**
    You need a free API key from OMDb. Go to [omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx) to get one.

4.  **Update the API Key:**
    Open the `js/script.js` and `details.html` files and replace the placeholder API key (`********`) with your personal OMDb API key.

5.  **Run Locally:**
    Open the `index.html` file in your favorite web browser.

---

## ✍️ Content Management

This project uses a simple, manual content management system by editing the `js/videos.js` file directly on GitHub.

#### How to Add New Content:

1.  Go to the `js/videos.js` file in your GitHub repository.
2.  Click the "Edit" icon (a small pencil) in the top-right corner.
3.  To add a new entry, copy an existing object (from `{` to `}`) and paste it into the array. Remember to add a comma `,` after the preceding object.
4.  Update the details for your new entry.

**Example for a Movie:**
```javascript
{
    "id": "new-movie-2025",
    "type": "movie",
    "subcategory": "Hollywood",
    "imdb_id": "tt1234567"
}
