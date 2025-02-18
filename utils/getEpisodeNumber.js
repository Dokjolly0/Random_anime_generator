const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

async function getEpisodeCount(url) {
  try {
    // Avvia Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Vai alla pagina
    await page.goto(url, { waitUntil: "networkidle0" });

    // Aspetta un po' per assicurarsi che la pagina sia completamente caricata
    await page.waitForTimeout(2000); // Attende 2 secondi (modifica questo tempo se necessario)

    // Estrai l'HTML della pagina
    const content = await page.content();

    // Usa cheerio per analizzare il contenuto della pagina
    const $ = cheerio.load(content);

    // Seleziona tutti gli elementi degli episodi
    const episodes = $(".episode-item");

    // Restituisci il numero di episodi trovati
    await browser.close();
    return episodes.length;
  } catch (error) {
    console.error("Errore nel recupero degli episodi:", error.message);
    return null;
  }
}

// Esempio di utilizzo
const url = "https://www.animeunity.so/randomanime";
getEpisodeCount(url).then((count) =>
  console.log(`Numero di episodi: ${count}`)
);
