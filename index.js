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
    // 1️⃣ Richiesta a /randomanime per ottenere il redirect
    const response = await axios.get("https://www.animeunity.so/randomanime", {
      maxRedirects: 0, // Disabilita il redirect automatico per catturarlo manualmente
      validateStatus: (status) => status === 302, // Accetta solo il codice 302
    });

    // 2️⃣ Controllo se l'header 'Location' esiste
    const animeUrl = response.headers.location;
    if (!animeUrl) {
      throw new Error("Redirect URL non trovato!");
    }

    // 3️⃣ Richiesta alla pagina effettiva dell'anime
    const animeResponse = await axios.get(animeUrl);
    const $ = cheerio.load(animeResponse.data);

    // 4️⃣ Estrazione delle informazioni
    const animePicture = $(".cover-wrap img").attr("src");
    // example: background: url(https://img.animeunity.so/anime/n272-FvZK2wFXEuay.jpg
    const bannerElement = $(".banner-wrapper div").attr("style");
    let urlBanner = null;
    if (bannerElement) {
      const urlArr = bannerElement.split("(");
      if (urlArr.length > 1) {
        urlBanner = urlArr[1].split(")")[0]; // Rimuove la parte finale dopo la chiusura del ')'
      }
    }

    // Creazione dell'oggetto anime con tutti i dettagli
    const anime = {
      url: animeUrl,
      cover: animePicture,
      banner: urlBanner,
      title: $("h1.title").text().trim(),
      description: $(".description").text().trim(),
      episodes: $(".episode-wrapper .episode-item a").length,
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

    console.log($(".episode-wrapper").html());

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

// const express = require("express");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const cors = require("cors");

// const app = express();
// const PORT = 3000;

// app.use(cors());

// // Funzione per ottenere un anime random
// const getRandomAnime = async () => {
//   try {
//     // 1️⃣ Richiesta a /randomanime per ottenere il redirect
//     const response = await axios.get("https://www.animeunity.so/randomanime", {
//       maxRedirects: 0, // Disabilita il redirect automatico per catturarlo manualmente
//       validateStatus: (status) => status === 302, // Accetta solo il codice 302
//     });

//     // 2️⃣ Controllo se l'header 'Location' esiste
//     const animeUrl = response.headers.location;
//     if (!animeUrl) {
//       throw new Error("Redirect URL non trovato!");
//     }

//     console.log("🔗 Anime URL:", animeUrl);

//     // 3️⃣ Richiesta alla pagina effettiva dell'anime
//     const animeResponse = await axios.get(animeUrl);
//     const $ = cheerio.load(animeResponse.data);

//     // 4️⃣ Estrazione delle informazioni
//     const animePicture = $(".cover-wrap img").attr("src");
//     const bannerElement = $(".banner-wrapper div").attr("style");
//     let banner = null;
//     if (bannerElement) {
//       const match = bannerElement.match(/url\(["']?(.*?)["']?\)/);
//       if (match) {
//         banner = match[1];
//       }
//     }

//     const anime = {
//       url: animeUrl,
//       animePicture,
//       banner,
//       title: $("h1.title").text().trim(),
//       description: $(".description").text().trim(),
//       episodes: $(".episode-wrapper .episode-item a").length,
//       genres: $(".info-wrapper small")
//         .map((i, el) => $(el).text().trim())
//         .get()
//         .filter((genre) => genre && !genre.includes("\n")),
//       rating: $(".info-item:contains('Valutazione') small").text().trim(),
//       type: $(".info-item:contains('Tipo') small").text().trim(),
//       episodeDuration: $(".info-item:contains('Durata episodio') small")
//         .text()
//         .trim(),
//       status: $(".info-item:contains('Stato') small").text().trim(),
//       year: $(".info-item:contains('Anno') small").text().trim(),
//       season: $(".info-item:contains('Stagione') small").text().trim(),
//       studio: $(".info-item:contains('Studio') small").text().trim(),
//       favorites: $(".info-item:contains('Preferiti') small").text().trim(),
//       members: $(".info-item:contains('Membri') small").text().trim(),
//       views: $(".info-item:contains('Visite') small").text().trim(),
//     };

//     return anime;
//   } catch (error) {
//     console.error("❌ Errore nel recupero dell'anime random:", error.message);
//     return null;
//   }
// };

// // Rotta API per ottenere un anime random
// app.get("/random-anime", async (req, res) => {
//   const anime = await getRandomAnime();
//   if (anime) {
//     res.json(anime);
//   } else {
//     res.status(500).json({ error: "Impossibile ottenere un anime random." });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
