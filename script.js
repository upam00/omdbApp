const data = [];

// Setup year selection dropdown
const yearSelect = document.getElementById("yearSelect");
for (let year = new Date().getFullYear(); year >= 1900; year--) {
    let option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

// Global variables for pagination
let currentPage = 1;
let lastQuery = "";
let lastYear = "";
let totalResults = 0;
let isLoading = false;

document.getElementById("searchButton").addEventListener("click", async function() {
    // Reset pagination when starting a new search
    currentPage = 1;
    
    const query = document.getElementById("searchBox").value.trim();
    const year = document.getElementById("yearSelect").value;
    
    // Store search parameters for pagination
    lastQuery = query;
    lastYear = year;
    
    searchMovies(query, year, currentPage, false);
});

async function searchMovies(query, year, page, append) {
    if (isLoading) return;
    isLoading = true;
    
    let apiKey = sessionStorage.getItem("key");
    let url = `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`;
    if (year) url += `&y=${year}`;
    
    const results = document.getElementById("movieResults");
    const scrollContainer = document.getElementById("scrollContainer");
    const loader = document.getElementById("loader");
    const msg = document.getElementById("msg");
    // If this is a new search (not appending), clear previous results
    if (!append) {
        results.innerHTML = ""; 
    }
    
    // Show loader
    loader.style.display = "block"; 
    scrollContainer.style.display = "flex"; 
    msg.style.display = "none";
    
    // Hide movie navigation buttons while loading
    if (!append) {
        document.querySelector(".scroll-btn.left").style.display = "none";
        document.querySelector(".scroll-btn.right").style.display = "none";
    }
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Hide loader
        loader.style.display = "none";
        
        if (data.Search) {
            // Store total results for pagination calculations
            totalResults = parseInt(data.totalResults);
            
            data.Search.forEach(movie => {
                const movieElement = document.createElement("div");
                movieElement.classList.add("movie-tile");
                
                // Add a placeholder while the image loads
                movieElement.innerHTML = `
                    <div class="placeholder">Loading...</div>
                    <p1 class="movie-title"><strong>${movie.Title}</strong></p>
                    <p>(${movie.Year})</p>
                    <p>Type: ${movie.Type || "N/A"}</p>
                   
                `;

                // Create and load the image
                const img = new Image();
                img.src = movie.Poster;
                img.alt = movie.Title;
                img.onload = function() {
                    movieElement.innerHTML = `
                        <img src="${movie.Poster}" alt="${movie.Title}">
                        <p class="movie-title"><strong>${movie.Title}</strong></p>
                        <p>(${movie.Year})</p>
                        <p>Type: ${movie.Type || "N/A"}</p>
                       
                    `;
                };
                img.onerror = function() {
                    movieElement.innerHTML = `
                        <img src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg">
                        <p class="movie-title"><strong>${movie.Title}</strong></p>
                        <p>(${movie.Year})</p>
                        <p>Type: ${movie.Type || "N/A"}</p>
                     
                    `;
                };

                movieElement.addEventListener("click", function() {
                    openPopup("https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1", movie);
                });

                results.appendChild(movieElement);
            });

            scrollContainer.style.display = "flex"; 
            document.querySelector(".scroll-btn.left").style.display = "block";
            document.querySelector(".scroll-btn.right").style.display = "block";
        } else {
            if (!append) {
                results.innerHTML = "<p>No movies found.</p>";
                scrollContainer.style.display = "none";
                msg.style.display = "block"; 
                msg.innerHTML = "<p>Oops. Can you please add a bit more detial?</p>";
            }
        }
    } catch (error) {
        console.log("Error fetching data:", error);
        if (!append) {
            results.innerHTML = "<p>Failed to load movies. Please try again.</p>";
            msg.style.display = "block"; 
            msg.innerHTML = "<p>Oops. Can you please add a bit more detial?</p>";
        }
    } finally {
        isLoading = false;
    }
}

function scLeft() {
    const container = document.getElementById("movieResults");
    container.scrollLeft -= 300;
}

function scrollRight() {
    const container = document.getElementById("movieResults");
    container.scrollLeft += 300;
    
    // Check if we're near the end of the scroll container
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 100) {
        // If we're at the end and there are more results to load
        const totalPages = Math.ceil(totalResults / 10); // OMDb API returns 10 results per page
        
        if (currentPage < totalPages && lastQuery) {
            currentPage++;
            searchMovies(lastQuery, lastYear, currentPage, true).then(() => {
                // Scroll one step to the right after new movies are loaded
                setTimeout(() => {
                    container.scrollLeft += 300;
                }, 100); // Small delay ensures movies are added first
            });
        } else if (currentPage >= totalPages) {
            // If no more pages, wrap back to start (your original behavior)
            container.scrollLeft = 0;
        }
    }
}

async function openPopup(trailerUrl, movieData) {
    const popup = document.getElementById("trailerPopup");
    document.getElementById("trailerFrame").src = trailerUrl;
    popup.classList.add("show");

    const movieDetails = document.getElementById("movieDetails");
    
    // Show loading state in the popup
    movieDetails.innerHTML = `
        <h3>${movieData.Title} (${movieData.Year})</h3>
        <p>Loading details...</p>
    `;
    
    try {
        // Fetch detailed movie information using the imdbID
        const apiKey = sessionStorage.getItem("key");
        const detailsUrl = `https://www.omdbapi.com/?i=${movieData.imdbID}&apikey=${apiKey}`;
        
        const response = await fetch(detailsUrl);
        const detailedMovie = await response.json();
        
        if (detailedMovie.Response === "True") {
            // Update the popup with the detailed information
            movieDetails.innerHTML = `
                <h3>${detailedMovie.Title} (${detailedMovie.Year})</h3>
                <p><strong>Genre:</strong> ${detailedMovie.Genre || "N/A"}</p>
                <p><strong>Director:</strong> ${detailedMovie.Director || "N/A"}</p>
                <p><strong>Actors:</strong> ${detailedMovie.Actors || "N/A"}</p>
                <p><strong>Plot:</strong> ${detailedMovie.Plot || "N/A"}</p>
                <p><strong>IMDB Rating:</strong> ${detailedMovie.imdbRating || "N/A"}</p>
                <p><strong>Runtime:</strong> ${detailedMovie.Runtime || "N/A"}</p>
                <p><strong>Released:</strong> ${detailedMovie.Released || "N/A"}</p>
            `;
        } else {
            // If the details API call fails, fallback to basic info
            movieDetails.innerHTML = `
                <h3>${movieData.Title} (${movieData.Year})</h3>
                <p><strong>IMDB ID:</strong> ${movieData.imdbID}</p>
                <p>Additional details could not be loaded.</p>
            `;
        }
    } catch (error) {
        console.error("Error fetching movie details:", error);
        // Fallback content on error
        movieDetails.innerHTML = `
            <h3>${movieData.Title} (${movieData.Year})</h3>
            <p>Failed to load additional details. Please try again.</p>
        `;
    }
}

function closePopup() {
    const popup = document.getElementById("trailerPopup");
    popup.classList.remove("show");
    setTimeout(() => {
        document.getElementById("trailerFrame").src = "";
    }, 300);
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keydown", function (event) {
        const scrollContainer = document.getElementById("movieResults");
        const activeMovie = document.activeElement; // Focused element
        const popup = document.getElementById("trailerPopup");

        // Prevent Enter key from causing default scrolling
        if (event.key === "Enter") {
            event.preventDefault();
        }

        // Left Arrow Key: Scroll Left
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollContainer.scrollBy({ left: -250, behavior: "smooth" });
        }

        // Right Arrow Key: Scroll Right
        else if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollContainer.scrollBy({ left: 250, behavior: "smooth" });
        }

        // Enter Key: Open Popup if a movie is focused
        else if (event.key === "Enter" && activeMovie.classList.contains("movie-tile")) {
            event.preventDefault();
        }

        // Escape Key: Close Popup
        else if (event.key === "Escape" && popup.classList.contains("show")) {
            event.preventDefault();
            closePopup();
        }
    });
});
