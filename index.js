document
  .getElementById("animeForm")
  .addEventListener("submit", async function () {
    event.preventDefault(); // Prevent form from submitting the default way
    // Get the number of anime to search for
    const animeCount = document.getElementById("animeCount").value;
    console.log(`Searching for ${animeCount} anime...`);
    try {
      // Fetch anime data from your backend
      const response = await fetch(
        `http://localhost:3000/random-anime/${animeCount}`
      );
      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const animeList = await response.json();
      console.log("Anime list fetched:", animeList);
      // Clear the anime grid before displaying new results
      const animeGrid = document.getElementById("animeGrid");
      animeGrid.innerHTML = "";
      // Loop through the fetched anime and create cards for each one
      animeList.forEach((anime) => {
        const animeCard = `
          <div class="col-md-4">
            <div class="card mb-4">
              <img src="${anime.cover}" class="card-img-top" alt="${
          anime.title
        }">
              <div class="card-body">
                <h5 class="card-title">${anime.title}</h5>
                <p class="card-text">${anime.description}</p>
                <p><strong>Genres:</strong> ${anime.genres.join(", ")}</p>
                <p><strong>Rating:</strong> ${anime.rating}</p>
                <p><strong>Year:</strong> ${anime.year}</p>
                <a href="${
                  anime.url
                }" class="btn btn-primary" target="_blank">More Info</a>
              </div>
            </div>
          </div>
        `;
        animeGrid.innerHTML += animeCard;
      });
    } catch (error) {
      console.error("Error fetching anime:", error);
      alert("There was an error fetching the anime. Please try again later.");
    }
  });
