const data  = []

const yearSelect = document.getElementById("yearSelect");
for (let year = new Date().getFullYear(); year >= 1900; year--) {
    let option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

document.getElementById("searchButton").addEventListener("click", async function() {
    const query = document.getElementById("searchBox").value.trim();
    const year = document.getElementById("yearSelect").value;
    let apiKey = sessionStorage.getItem("key");
    let url = `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
    if (year) url += `&y=${year}`;
    
    let results = document.getElementById("movieResults");
    const scrollContainer = document.getElementById("scrollContainer");
    const loader = document.getElementById("loader");

    // Show loader outside of the scroll container
    results.innerHTML = ""; // Clear previous results
    document.getElementById("loader").style.display = "block"; // Show the loader
    scrollContainer.style.display = "flex"; // Show scroll container but it will only have the loader visible
    
    // Hide movie navigation buttons while loading
    document.querySelector(".scroll-btn.left").style.display = "none";
    document.querySelector(".scroll-btn.right").style.display = "none";
    
    try {
        const response = await fetch(url);
        const data = await response.json();

         // Hide loader
        document.getElementById("loader").style.display = "none";
        
        if (data.Search) {
            data.Search.forEach(movie => {
                const movieElement = document.createElement("div");
                movieElement.classList.add("movie-tile");
                
             
                // Add a placeholder while the image loads
                movieElement.innerHTML = `
                    <div class="placeholder">Loading...</div>
                    <p class="movie-title"><strong>${movie.Title}</strong></p>
                    <p>(${movie.Year})</p>
                    <p>Genre: ${movie.Genre}</p>
                    <p>IMDB Rating: ${movie.imdbRating || "N/A"}</p>
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
                        <p>Genre: ${movie.Genre}</p>
                        <p>IMDB Rating: ${movie.imdbRating || "N/A"}</p>
                    `;
                };
                img.onerror = function() {
                    movieElement.innerHTML = `
                        <p class="movie-title"><strong>${movie.Title}</strong></p>
                        <p>(${movie.Year})</p>
                        <p>Genre: ${movie.Genre}</p>
                        <p>IMDB Rating: ${movie.imdbRating || "N/A"}</p>
                        <p style="color:red;">Image Not Available</p>
                    `;
                };

                movieElement.addEventListener("click", function() {
                    openPopup("https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1", movie);
                });

                results.appendChild(movieElement);
            });

            scrollContainer.style.display = "flex"; // Show after movies load
            document.querySelector(".scroll-btn.left").style.display = "block";
            document.querySelector(".scroll-btn.right").style.display = "block";
        } else {
            results.innerHTML = "<p>No movies found.</p>";
            scrollContainer.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        results.innerHTML = "<p>Failed to load movies. Please try again.</p>";
    }
});


function scLeft() {
    const container = document.getElementById("movieResults");
    container.scrollLeft -= 300;
    
}

function scrollRight() {
    const container = document.getElementById("movieResults");
    container.scrollLeft += 300;
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
        container.scrollLeft = 0;
    }
}


function openPopup(trailerUrl, movieData) {
    const popup = document.getElementById("trailerPopup");
    document.getElementById("trailerFrame").src = trailerUrl;
    popup.classList.add("show");

    const movieDetails = document.getElementById("movieDetails");
    movieDetails.innerHTML = `
        <h3>${movieData.Title} (${movieData.Year})</h3>
        <p><strong>Genre:</strong> ${movieData.Genre}</p>
        <p><strong>Director:</strong> ${movieData.Director}</p>
        <p><strong>Actors:</strong> ${movieData.Actors}</p>
        <p><strong>Plot:</strong> ${movieData.Plot}</p>
        <p><strong>IMDB Rating:</strong> ${movieData.imdbRating}</p>
    `;
}


function closePopup() {
    const popup = document.getElementById("trailerPopup");
    popup.classList.remove("show");
    setTimeout(() => {
        document.getElementById("trailerFrame").src = "";
    }, 300);
}

