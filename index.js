const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());

// Funzione per ottenere un anime random
const getRandomAnime = async () => {
  try {
    const response = await axios.get("https://www.animeunity.so/randomanime");
    const $ = cheerio.load(response.data);

    // Estrazione dell'URL dell'immagine di copertina
    const image = $(".cover-wrap img").attr("src");

    // Estrazione dell'URL del banner // example: background: url(https://img.animeunity.so/anime/n272-FvZK2wFXEuay.jpg
    const bannerElement = $(".banner-wrapper div").attr("style");
    let url = null;
    if (bannerElement) {
      const urlArr = bannerElement.split("(");
      if (urlArr.length > 1) {
        url = urlArr[1].split(")")[0]; // Rimuove la parte finale dopo la chiusura del ')'
      }
    }

    // Creazione dell'oggetto anime con tutti i dettagli
    const anime = {
      image,
      banner: url,
      title: $("h1.title").text().trim(),
      description: $(".description").text().trim(),
      episodes: $(".episode-wrapper .episode-item").length,
      genres: $(".info-wrapper small")
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((genre) => genre && !genre.includes("\n")),
      rating: $(".info-item:contains('Valutazione') small").text().trim(),
      type: $(".info-item:contains('Tipo') small").text().trim(),
      episodeDuration: $(".info-item:contains('Durata episodio') small")
        .text()
        .trim(),
      status: $(".info-item:contains('Stato') small").text().trim(),
      year: $(".info-item:contains('Anno') small").text().trim(),
      season: $(".info-item:contains('Stagione') small").text().trim(),
      studio: $(".info-item:contains('Studio') small").text().trim(),
      favorites: $(".info-item:contains('Preferiti') small").text().trim(),
      members: $(".info-item:contains('Membri') small").text().trim(),
      views: $(".info-item:contains('Visite') small").text().trim(),
    };

    // Pulizia dei generi
    anime.genres = anime.genres.filter((genre) => genre && genre !== "");

    // Estrazione del voto come numero
    const ratingText = $(".info-item:contains('Valutazione') small")
      .text()
      .trim();
    anime.rating = parseFloat(ratingText) || "N/A";

    return anime;
  } catch (error) {
    console.error("Error fetching random anime:", error);
    return null;
  }
};

// Rotta per ottenere un numero specifico di anime random
app.get("/random-anime/:count", async (req, res) => {
  const count = parseInt(req.params.count, 10);
  const animeList = [];

  for (let i = 0; i < count; i++) {
    const anime = await getRandomAnime();
    if (anime) {
      animeList.push(anime);
    }
  }

  // Creazione della cartella "data" se non esiste
  const responseDir = path.join(__dirname, "data");
  if (!fs.existsSync(responseDir)) {
    fs.mkdirSync(responseDir);
  }

  // Salvataggio della risposta come file JSON
  const filePath = path.join(responseDir, "response.json");
  fs.writeFileSync(filePath, JSON.stringify(animeList, null, 2));

  res.json(animeList);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//Fix
/*
<div class="info-wrapper pt-3 anime-info-wrapper"><div class="info-item"><strong>Tipo</strong><br> <small>TV</small></div> <div class="info-item"><strong>Episodi</strong><br> <small>24</small></div> <div class="info-item"><strong>Durata episodio</strong><br> <small>24 min</small></div> <div class="info-item"><strong>Stato</strong><br> <small>Terminato</small></div> <div class="info-item"><strong>Anno</strong><br> <small>2014</small></div> <div class="info-item"><strong>Stagione</strong><br> <small>Autunno</small></div> <div class="info-item"><strong>Studio</strong><br> <small>Studio Pierrot</small></div> <div class="info-item"><strong>Valutazione</strong><br> <small>8.38</small> <i class="icon-score-star"></i></div> <div class="info-item"><strong>Preferiti</strong><br> <small>681</small> <i class="fas fa-heart d-inline-block" style="font-size: 10px !important; color: red;"></i></div> <div class="info-item"><strong>Membri</strong><br> <small>4.048</small> <i class="fas fa-user d-inline-block" style="font-size: 10px !important;"></i></div> <div class="info-item"><strong>Visite</strong><br> <small id="episode-visual">653.522</small> <small><i class="fas fa-eye"></i></small></div></div>
*/
