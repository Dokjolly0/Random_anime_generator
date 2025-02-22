const puppeteer = require("puppeteer");

const getEpisodesWithPuppeteer = async (logging = false) => {
  // Inizia a misurare il tempo totale
  if (logging) console.time("Total Time");

  // Creazione di un'istanza di Puppeteer
  const browser = await puppeteer.launch({ headless: true, timeout: 10000 });
  const page = await browser.newPage();

  // Inizia a misurare il tempo di caricamento della pagina
  if (logging) console.time("Page Load Time");
  await page.goto("https://www.animeunity.so/randomanime", {
    waitUntil: "domcontentloaded", // Attende solo che il DOM sia pronto
  });

  // Termina il tempo di caricamento della pagina e inizia a misurare il tempo di intercettazione delle richieste
  if (logging) console.timeEnd("Page Load Time");
  if (logging) console.time("Request Interception Time");

  // Interrompe le richieste non necessarie
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (
      request.resourceType() === "image" ||
      request.resourceType() === "stylesheet" ||
      request.resourceType() === "font" ||
      request.resourceType() === "media" ||
      request.resourceType() === "script"
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  // Termina il tempo di intercettazione delle richieste e inizia a misurare il tempo di attesa per il selettore
  if (logging) console.timeEnd("Request Interception Time");
  if (logging) console.time("Selector Wait Time");

  // Attendi il selettore degli episodi
  await page.waitForSelector(".episode-wrapper", { timeout: 5000 }); // Max 5 secondi
  // Termina il tempo di attesae inizia a misurare il tempo per l'estrazione degli episodi
  if (logging) console.timeEnd("Selector Wait Time");
  if (logging) console.time("Episodes Extraction Time");

  // Estrai il numero di episodi
  const episodes = await page.$$eval(
    ".episode-wrapper .episode-item a",
    (els) => els.length
  );

  // Termina il tempo per l'estrazione degli episodi e chiudi il browser
  if (logging) console.timeEnd("Episodes Extraction Time");
  await browser.close();

  // Termina il tempo totale
  if (logging) console.timeEnd("Total Time");
  return episodes;
};

getEpisodesWithPuppeteer(true).then((episodes) =>
  console.log("Episodi:", episodes)
);
