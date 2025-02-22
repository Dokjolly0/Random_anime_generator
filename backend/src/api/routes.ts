import express from "express";
import userRouter from "./user/user.router";
import authRouter from "./auth/auth.router";
import generateAnimeRouter from "./generate-anime/generate-anime.router";

const router = express.Router();

router.use("/users", userRouter);
router.use(authRouter);
router.use(generateAnimeRouter);

export default router;
