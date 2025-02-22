import { Request, Response, NextFunction } from "express";
import { Anime } from "./generate-anime.entity";
import { GenerateAnime } from "./generate-anime.service";
import * as fs from "fs";
import * as path from "path";

export const generateAnime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = parseInt(req.params.count);
    const animeList: Anime[] = [];
    const generateAnimeSrv = new GenerateAnime();

    for (let i = 0; i < count; i++) {
      const anime: Anime | null = await generateAnimeSrv.generateAnime();
      if (anime != null) {
        animeList.push(anime);
      }
    }

    // Creazione della cartella "data" se non esiste
    const responseDir = path.join(__dirname, "../../../data");
    if (!fs.existsSync(responseDir)) {
      fs.mkdirSync(responseDir);
    }

    // Salvataggio della risposta come file JSON
    const filePath = path.join(responseDir, "response.json");
    fs.writeFileSync(filePath, JSON.stringify(animeList, null, 2));

    res.json(animeList);
  } catch (error: any) {
    next(error);
  }
};
