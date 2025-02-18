const puppeteer = require("puppeteer");

const getEpisodesWithPuppeteer = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.animeunity.so/randomanime", {
    waitUntil: "networkidle2",
  });

  // Aspetta che gli episodi vengano caricati
  await page.waitForSelector(".episode-wrapper");

  // Estrai il numero di episodi
  const episodes = await page.$$eval(
    ".episode-wrapper .episode-item a",
    (els) => els.length
  );

  await browser.close();
  return episodes;
};

getEpisodesWithPuppeteer().then((episodes) =>
  console.log("Episodi:", episodes)
);

// const express = require("express");
// const puppeteer = require("puppeteer");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.use(cors());

// // Funzione per ottenere un anime random con Puppeteer
// const getRandomAnime = async () => {
//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Simuliamo un vero browser con uno User-Agent
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
//     );

//     await page.goto("https://www.animeunity.so/randomanime", {
//       waitUntil: "networkidle2", // Aspetta il caricamento della pagina
//     });

//     // Aspetta che gli episodi vengano caricati
//     await page.waitForSelector(".episode-wrapper");

//     // Estrai il numero di episodi
//     const episodes = await page.$$eval(
//       ".episode-wrapper .episode-item a",
//       (els) => els.length
//     );

//     // Estrai i dettagli dell'anime
//     const anime = await page.evaluate(() => {
//       const getText = (selector) => {
//         const el = document.querySelector(selector);
//         return el ? el.innerText.trim() : "N/A";
//       };

//       const getGenres = () => {
//         return Array.from(document.querySelectorAll(".info-wrapper small"))
//           .map((el) => el.innerText.trim())
//           .filter((genre) => genre && !genre.includes("\n"));
//       };

//       // Trova l'URL dell'immagine di copertina
//       const image = document.querySelector(".cover-wrap img")?.src || "N/A";

//       // Trova il banner (se esiste)
//       let banner = null;
//       const bannerElement = document.querySelector(".banner-wrapper div")?.style
//         .background;
//       if (bannerElement) {
//         const urlMatch = bannerElement.match(/\((.*?)\)/);
//         banner = urlMatch ? urlMatch[1] : null;
//       }

//       return {
//         image,
//         banner,
//         title: getText("h1.title"),
//         description: getText(".description"),
//         genres: getGenres(),
//         rating:
//           parseFloat(getText(".info-item:contains('Valutazione') small")) ||
//           "N/A",
//         type: getText(".info-item:contains('Tipo') small"),
//         episodeDuration: getText(
//           ".info-item:contains('Durata episodio') small"
//         ),
//         status: getText(".info-item:contains('Stato') small"),
//         year: getText(".info-item:contains('Anno') small"),
//         season: getText(".info-item:contains('Stagione') small"),
//         studio: getText(".info-item:contains('Studio') small"),
//         favorites: getText(".info-item:contains('Preferiti') small"),
//         members: getText(".info-item:contains('Membri') small"),
//         views: getText(".info-item:contains('Visite') small"),
//       };
//     });

//     // Aggiungiamo il numero di episodi estratto con Puppeteer
//     anime.episodes = episodes;

//     await browser.close();
//     return anime;
//   } catch (error) {
//     console.error("Error fetching random anime:", error);
//     return null;
//   }
// };

// // Rotta per ottenere un numero specifico di anime random
// app.get("/random-anime/:count", async (req, res) => {
//   const count = parseInt(req.params.count, 10);
//   const animeList = [];

//   for (let i = 0; i < count; i++) {
//     const anime = await getRandomAnime();
//     if (anime) {
//       animeList.push(anime);
//     }
//   }

//   // Creazione della cartella "data" se non esiste
//   const responseDir = path.join(__dirname, "data");
//   if (!fs.existsSync(responseDir)) {
//     fs.mkdirSync(responseDir);
//   }

//   // Salvataggio della risposta come file JSON
//   const filePath = path.join(responseDir, "response.json");
//   fs.writeFileSync(filePath, JSON.stringify(animeList, null, 2));

//   res.json(animeList);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
