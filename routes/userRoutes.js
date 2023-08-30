import express from "express";

import {
  showCurrentUser,
  getAllUsers,
} from "../controllers/userControllers.js";
import authentication from "../middlewares/authentication.js";
import authorizePermissions from "../middlewares/authorizePermissions.js";

const router = express.Router();

router.get("/", authentication, authorizePermissions("admin"), getAllUsers);
router.get("/showMe", authentication, showCurrentUser);

export default router;
