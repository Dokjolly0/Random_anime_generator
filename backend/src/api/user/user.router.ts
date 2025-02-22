import express from "express";
import { isAuthenticated } from "../../utils/auth/authenticated-middleware";
import { me, password, username } from "./user.controller";
import { list } from "./user.controller";
import { ChangePasswordDTO } from "./user.dto";
import { validate } from "../../utils/validation-middleware";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

// Example without users
// if (process.env.USE_USERS) router.use(isAuthenticated);

router.use(isAuthenticated);
router.get("/", list);
router.get("/me", me);
router.get("/username", username);
router.post("/password", validate(ChangePasswordDTO), password);

export default router;
