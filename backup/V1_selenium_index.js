const { Builder, By } = require("selenium-webdriver");
const express = require("express");
const app = express();
const PORT = 3000;
const animeList = [];

app.use(express.static("public"));

async function getAnimeData() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("https://www.animeunity.so/randomanime");

    let title = await driver.findElement(By.css("h1.title")).getText();
    let description = await driver
      .findElement(By.css("div.description"))
      .getText();
    let cover = await driver
      .findElement(By.css(".cover-wrap img"))
      .getAttribute("src");
    let genres = await driver.findElements(By.css(".info-wrapper div small"));
    let genreList = [];

    for (let genre of genres) {
      genreList.push(await genre.getText());
    }

    let animeInfo = await driver.findElements(
      By.css(".anime-info-wrapper div")
    );
    let details = {};

    for (let info of animeInfo) {
      let key = await info.findElement(By.css("strong")).getText();
      let value = await info.findElement(By.css("small")).getText();
      details[key] = value;
    }

    let episodes = await driver.findElements(
      By.css(".episode-wrapper .episode-item")
    );
    let episodeCount = episodes.length;

    animeList.push({
      title,
      description,
      cover,
      genreList,
      details,
      episodeCount,
    });
  } finally {
    await driver.quit();
  }
}

app.get("/fetchAnime", async (req, res) => {
  animeList.length = 0;
  let count = req.query.count || 1;
  for (let i = 0; i < count; i++) {
    await getAnimeData();
  }
  res.json(animeList);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
