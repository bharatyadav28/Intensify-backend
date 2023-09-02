import express from "express";

import {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPasword,
} from "../controllers/authContollers.js";
import authentication from "../middlewares/authentication.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.delete("/logout", authentication, logout);

router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPasword);

export default router;
