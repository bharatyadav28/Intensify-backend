import express from "express";

import { showCurrentUser } from "../controllers/userControllers.js";
import authentication from "../middlewares/authentication.js";

const router = express.Router();

router.get("/showMe", authentication, showCurrentUser);

export default router;
