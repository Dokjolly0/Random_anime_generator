const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// Funzione per ottenere un anime random
const getRandomAnime = async () => {
  try {
    const response = await axios.get("https://www.animeunity.so/randomanime");
    const $ = cheerio.load(response.data);

    console.log(response);

    const anime = {
      image: $(".cover-wrap img").attr("src"),
      title: $("h1.title").text().trim(),
      description: $(".description").text().trim(),
      // Count all the <a> tags inside the .episode div
      episodes: $(".episode .episode-item a").length,
      genres: $(".info-wrapper small")
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((genre) => genre && !genre.includes("\n")),
      rating: $(".anime-info-wrapper strong").text().trim(),
      seasons: $(".anime-info-wrapper small").text().trim(),
    };

    console.log(anime.episodes);

    // Pulizia dei generi
    anime.genres = anime.genres.filter((genre) => genre && genre !== "");

    // Estrazione del voto
    const ratingText = $(".anime-info-wrapper strong").text().trim();
    anime.rating = parseFloat(ratingText) || "N/A";

    // Estrazione delle stagioni e altre informazioni
    const infoText = $(".anime-info-wrapper small").text().trim();
    anime.seasons = infoText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");

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

  res.json(animeList);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
