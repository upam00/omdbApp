const data  = []

const yearSelect = document.getElementById("yearSelect");
for (let year = new Date().getFullYear(); year >= 1900; year--) {
    let option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

document.getElementById("searchButton").addEventListener("click", function() {
    const query = document.getElementById("searchBox").value;
    const year = document.getElementById("yearSelect").value;
    let apiKey = sessionStorage.getItem("key");
    let url = `https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
    if (year) url += `&y=${year}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const results = document.getElementById("movieResults");
            const scrollContainer = document.getElementById("scrollContainer");
            results.innerHTML = "";
            if (data.Search) {
                data.Search.forEach(movie => {
                    const movieElement = document.createElement("div");
                    movieElement.classList.add("movie-tile");
                    movieElement.innerHTML = `
                        <img src="${movie.Poster}" alt="${movie.Title}">
                        <p><strong>${movie.Title}</strong></p>
                        <p>(${movie.Year})</p>
                        <p>Genre: ${movie.Genre}</p>
                        <p>IMDB Rating:${movie.imdbRating}</p>
                    `;
                    movieElement.addEventListener("click",  function() {
                        openPopup("https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1", movie);
                    });
                    results.appendChild(movieElement);
                });
                scrollContainer.style.display = "flex";
                document.querySelector(".scroll-btn.left").style.display = "block";
                document.querySelector(".scroll-btn.right").style.display = "block";
            } else {
                results.innerHTML = "<p>No movies found.</p>";
                scrollContainer.style.display = "none";
            }
        })
        .catch(error => console.error("Error fetching data:", error));

    // const results = document.getElementById("movieResults");
    // const scrollContainer = document.getElementById("scrollContainer");
    // results.innerHTML = "";
    // if(data) {
    //     data.forEach(movie => {
    //         const movieElement = document.createElement("div");
    //         movieElement.classList.add("movie-tile");
    //         movieElement.innerHTML = `
    //             <img src="${movie.Poster}" alt="${movie.Title}">
    //             <p>${movie.Title} (${movie.Year})</p>
    //             <p><strong>Type:</strong> ${movie.Type}</p>
    //         `;
    //         movieElement.addEventListener("click",  function() {
    //             openPopup("https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1", movie);
    //         });
           
    //         results.appendChild(movieElement);
    //     });
    // }
    // scrollContainer.style.display = "flex";
    // document.querySelector(".scroll-btn.left").style.display = "block";
    // document.querySelector(".scroll-btn.right").style.display = "block";

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