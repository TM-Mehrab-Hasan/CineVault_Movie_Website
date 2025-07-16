# MovieSaviour 🎬

MovieSaviour is a dynamic, fully responsive website for Browse and streaming a personal collection of movies, dramas, and animes. It leverages modern web technologies to provide a seamless user experience, fetching rich metadata from the OMDb API and serving video content directly from Google Drive.


---
## ✨ Key Features

* **Dynamic Content:** Fetches posters, titles, ratings, plots, and more from the OMDb API.
* **Advanced Categorization:** Filters content by type (Movie, Drama, Anime) and subcategory (e.g., Bollywood, Korean) using dropdown menus.
* **Detailed Info Pages:** Each item has a dedicated page with comprehensive information and a full episode list for series.
* **Enhanced Video Player:** When watching a series, the player page displays a list of all other episodes for easy navigation, highlighting the current one.
* **Alphabetical Sorting:** All content lists are automatically sorted alphabetically by title for easy Browse.
* **Client-Side Search:** Instantly filters the displayed items on the homepage by title.
* **Loading Indicators:** A smooth loading spinner provides a better user experience while data is being fetched.
* **Responsive Design:** The interface is optimized for all screen sizes, from mobile phones to desktops.

---

## 🛠️ Tech Stack

* **Front-End:** HTML5, CSS3 (Flexbox & Grid), and modern JavaScript (ES6+).
* **API:** [The OMDb API](http://www.omdbapi.com/) for fetching all movie, drama, and anime metadata.
* **Hosting:** Hosted on [Netlify](https://www.netlify.com/) with continuous deployment from GitHub.

---

## 🚀 Live Demo

You can view the live project here: **[https://moviesaviour.netlify.app/](https://moviesaviour.netlify.app/)**

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
    Open the `js/script.js` and `details.html` files and replace the placeholder API key (`60f2fb19`) with your personal OMDb API key.

5.  **Run Locally:**
    Open the `index.html` file in your favorite web browser.

---

## ✍️ Content Management

This project uses a simple, manual content management system by editing the `videos.js` file directly on GitHub. This gives you full control over your library.

#### How to Add a New Movie or Series:

1.  **Go to the `js/videos.js` file** in your GitHub repository:
    [https://github.com/TMRatul49/MovieSaviour_Website/blob/main/js/videos.js](https://github.com/TMRatul49/MovieSaviour_Website/blob/main/js/videos.js)

2.  **Click the "Edit" icon** (a small pencil) in the top-right corner of the file view.

3.  To add a new entry, copy an existing object (from `{` to `}`) and paste it at the end of the list, ensuring there is a comma `,` after the preceding object.

4.  **Update the details** for your new entry:
    * `id`: A unique, all-lowercase name (e.g., `"the-dark-knight"`).
    * `type`: `"movie"`, `"drama"`, or `"anime"`.
    * `subcategory`: The specific category (e.g., `"Hollywood"`).
    * `imdb_id`: The correct ID from the IMDb website (e.g., `"tt0468569"`).
    * `google_drive_id` (for movies) or `seasons`/`episodes` (for series) with your Google Drive links.

5.  **Scroll down and save** by clicking the "Commit changes" button. Netlify will automatically see the update and deploy your new content to the live site within minutes.
