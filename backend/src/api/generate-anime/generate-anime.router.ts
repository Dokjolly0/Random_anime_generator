import express from "express";
import { generateAnime } from "./generate-anime.controller";

const router = express.Router();
router.get("/generate-anime/:count", generateAnime);

export default router;
