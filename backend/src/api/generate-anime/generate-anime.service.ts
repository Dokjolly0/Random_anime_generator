import axios from "axios";
import * as cheerio from "cheerio";
import { Anime } from "./generate-anime.entity";

export class GenerateAnime {
  async generateAnime(): Promise<Anime | null> {
    try {
      const startRequest = Date.now();
      const response = await axios.get(
        "https://www.animeunity.so/randomanime",
        {
          maxRedirects: 0,
          validateStatus: (status) => status === 302,
        }
      );

      const animeUrl = response.headers.location;
      if (!animeUrl) {
        throw new Error("Redirect URL not found!");
      }

      const animeResponse = await axios.get(animeUrl);
      const $ = cheerio.load(animeResponse.data);
      const endRequest = Date.now();

      // 4️⃣ Estrazione delle informazioni
      const animePicture = $(".cover-wrap img").attr("src");
      // example: background: url(https://img.animeunity.so/anime/n272-FvZK2wFXEuay.jpg
      const bannerElement = $(".banner-wrapper div").attr("style");
      let urlBanner: string | null = null;
      if (bannerElement) {
        const urlArr = bannerElement.split("(");
        if (urlArr.length > 1) {
          urlBanner = urlArr[1].split(")")[0]; // Rimuove la parte finale dopo la chiusura del ')'
        }
      }

      let otherInfo = {};
      $(".info-wrapper .info-item")
        .map((i, el) => {
          const key = $(el).find("strong").text().trim();
          const value = $(el).find("small").text().trim();
          otherInfo[key] = value;
          return key && value ? [key, value] : null;
        })
        .get();

      const anime: Anime = {
        url: animeUrl,
        cover: $(".cover-wrap img").attr("src") || "",
        banner: urlBanner,
        title: $("h1.title").text().trim(),
        description: $(".description").text().trim(),
        episodes:
          parseInt(
            $(".info-item:contains('Episodi') small").text().trim(),
            10
          ) || 0,
        genres: $(".info-wrapper:contains('Generi') a.genre-link")
          .map((_, el) => $(el).text().trim().replace(",", ""))
          .get(),
        rating:
          parseFloat(
            $(".info-item:contains('Valutazione') small").text().trim()
          ) || "N/A",
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
        otherInfoFetched: otherInfo,
        startRequest: startRequest,
        endRequest: endRequest,
        requestTime: endRequest - startRequest,
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
  }
}
