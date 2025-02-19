document.addEventListener("DOMContentLoaded", function () {
  let animeList = []; // Dati anime

  // Seleziona elementi DOM
  const animeCountInput = document.getElementById("animeCount");
  const genreFilter = document.getElementById("genreFilter");
  const sortOrder = document.getElementById("sortOrder");
  const applyFiltersBtn = document.querySelector(".apply-filters");
  const searchBtn = document.querySelector(".search-btn");

  // Disabilita i filtri all'inizio
  function disableFilters(disabled) {
    genreFilter.disabled = disabled;
    sortOrder.disabled = disabled;
    applyFiltersBtn.disabled = disabled;

    // Imposta o rimuove il tooltip
    const tooltipText = disabled ? "Prima genera un anime" : "";
    genreFilter.setAttribute("title", tooltipText);
    sortOrder.setAttribute("title", tooltipText);
    applyFiltersBtn.setAttribute("title", tooltipText);
  }
  disableFilters(true); // Disabilita all'avvio

  searchBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const animeCount = parseInt(animeCountInput.value);
    if (isNaN(animeCount) || animeCount < 1) {
      alert("Please enter a valid number greater than 0.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/random-anime/${animeCount}`
      );
      animeList = response.data; // Salva i dati anime
      populateGenreFilter();
      displayAnime(animeList);

      disableFilters(false); // Abilita i filtri
    } catch (error) {
      console.error("Error fetching anime:", error);
      alert("There was an error fetching the anime. Please try again later.");
    }
  });

  // Mostra gli anime filtrati
  function displayAnime(filteredAnime) {
    const animeGrid = document.getElementById("animeGrid");
    animeGrid.innerHTML = ""; // Pulisce i risultati precedenti

    filteredAnime.forEach((anime) => {
      const animeCard = document.createElement("div");
      animeCard.classList.add("col-md-4");

      animeCard.innerHTML = `
        <div class="card mb-4">
          <img src="${anime.cover}" class="card-img-top" alt="${anime.title}">
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
      `;

      animeGrid.appendChild(animeCard);
    });
  }

  // Popola il filtro generi
  function populateGenreFilter() {
    genreFilter.innerHTML = `<option value="">All Genres</option>`; // Reset

    const genres = new Set();
    animeList.forEach((anime) =>
      anime.genres.forEach((genre) => genres.add(genre))
    );

    genres.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genre;
      genreFilter.appendChild(option);
    });
  }

  // Applica i filtri e ordinamenti
  applyFiltersBtn.addEventListener("click", function () {
    const selectedGenre = genreFilter.value;
    const sortOrderValue = sortOrder.value;

    let filteredAnime = animeList;

    // Filtra per genere se selezionato
    if (selectedGenre) {
      filteredAnime = filteredAnime.filter((anime) =>
        anime.genres.includes(selectedGenre)
      );
    }

    // Ordina per rating o anno
    if (sortOrderValue === "rating") {
      filteredAnime.sort((a, b) => b.rating - a.rating);
    } else if (sortOrderValue === "year") {
      filteredAnime.sort((a, b) => b.year - a.year);
    }

    displayAnime(filteredAnime);
  });
});
