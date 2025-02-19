document.addEventListener("DOMContentLoaded", function () {
  let animeList = []; // Dati anime

  // Seleziona elementi DOM
  const animeCountInput = document.getElementById("animeCount");
  const sortOrder = document.getElementById("sortOrder");
  const applyFiltersBtn = document.querySelector(".apply-filters");
  const searchBtn = document.querySelector(".search-btn");
  const genreForm = document.getElementById("genreForm");
  const applyGenreFilterBtn = document.getElementById("applyGenreFilter");
  const genreModal = new bootstrap.Modal(document.getElementById("genreModal"));
  const filterByGenreBtn = document.getElementById("selectedGenres"); // Bottone per aprire il popup dei generi

  let selectedGenres = [];

  // Disabilita i filtri all'inizio
  function disableFilters(disabled) {
    sortOrder.disabled = disabled;
    applyFiltersBtn.disabled = disabled;
    filterByGenreBtn.disabled = disabled; // Disabilita anche il bottone "Filtra Generi"

    // Imposta o rimuove il tooltip
    const tooltipText = disabled ? "Prima genera un anime" : "";
    sortOrder.setAttribute("title", tooltipText);
    applyFiltersBtn.setAttribute("title", tooltipText);
    filterByGenreBtn.setAttribute("title", tooltipText);
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
      populateGenreForm();
      displayAnime(animeList);

      disableFilters(false); // Abilita i filtri
    } catch (error) {
      console.error("Error fetching anime:", error);
      alert("There was an error fetching the anime. Please try again later.");
    }
  });

  // Popola il form con le checkbox per i generi
  function populateGenreForm() {
    genreForm.innerHTML = ""; // Reset

    const genres = new Set();
    animeList.forEach((anime) =>
      anime.genres.forEach((genre) => genres.add(genre))
    );

    genres.forEach((genre) => {
      const div = document.createElement("div");
      div.classList.add("form-check");
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${genre}" id="genre_${genre}">
        <label class="form-check-label" for="genre_${genre}">
          ${genre}
        </label>
      `;
      genreForm.appendChild(div);
    });
  }

  // Funzione per aprire il modal
  applyGenreFilterBtn.addEventListener("click", function () {
    // Raccoglie i generi selezionati
    selectedGenres = [];
    document
      .querySelectorAll('#genreForm input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        selectedGenres.push(checkbox.value);
      });
    genreModal.hide(); // Chiude il modal
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

  // Applica i filtri e ordinamenti
  applyFiltersBtn.addEventListener("click", function () {
    let filteredAnime = animeList;

    // Filtra per generi se selezionato
    if (selectedGenres.length > 0) {
      filteredAnime = filteredAnime.filter((anime) =>
        anime.genres.some((genre) => selectedGenres.includes(genre))
      );
    }

    // Ordina per rating o anno
    const sortOrderValue = sortOrder.value;
    if (sortOrderValue === "rating_asc") {
      filteredAnime.sort((a, b) => a.rating - b.rating);
    } else if (sortOrderValue === "rating_desc") {
      filteredAnime.sort((a, b) => b.rating - a.rating);
    } else if (sortOrderValue === "year_asc") {
      filteredAnime.sort((a, b) => a.year - b.year);
    } else if (sortOrderValue === "year_desc") {
      filteredAnime.sort((a, b) => b.year - a.year);
    }

    displayAnime(filteredAnime);
  });
});
