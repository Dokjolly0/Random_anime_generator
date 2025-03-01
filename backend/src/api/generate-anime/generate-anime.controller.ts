import { Request, Response, NextFunction } from "express";
import { Anime } from "./generate-anime.entity";
import { GenerateAnime } from "./generate-anime.service";
import * as fs from "fs";
import * as path from "path";
import pLimit from "p-limit"; // Importa p-limit

// api/generate-anime/100?limit=2
export const generateAnime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = parseInt(req.params.count);
    const animeList: Anime[] = [];
    const generateAnimeSrv = new GenerateAnime();
    const LIMIT = req.query.limit ? parseInt(req.query.limit as string) : 2;
    const limit = pLimit(LIMIT); // Limita a 2 richieste simultanee

    // Usa p-limit per limitare la concorrenza delle richieste
    const tasks = Array.from({ length: count }).map(() =>
      limit(async () => {
        const anime: Anime | null = await generateAnimeSrv.generateAnime();
        if (anime != null) {
          animeList.push(anime);
        }
      })
    );
    await Promise.all(tasks);

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
