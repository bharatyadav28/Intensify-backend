import express from "express";

import {
  getAllReviews,
  createReview,
  getSingleReview,
  getSingleCoursetReviews,
  getTopReviews,
  hasAlreadySubmitted,
} from "../controllers/ReviewControllers.js";
import authentication from "../middlewares/authentication.js";
import authorizePermissions from "../middlewares/authorizePermissions.js";

const router = express.Router();

router.route("/").get(getAllReviews).post(authentication, createReview);

router.route("/top").get(getTopReviews);
router.route("/hasSubmitted").get(authentication, hasAlreadySubmitted);

router.route("/product/:id").get(authentication, getSingleCoursetReviews);
router.route("/:id").get(authentication, getSingleReview);

export default router;
