import express from "express";

import {
  createMainCaroselItem,
  getMainCaroselItems,
  updateMainCarouselItem,
  uploadCarouselItemImage,
} from "../controllers/mainCarouselContollers.js";

const router = express.Router();

router.route("/").get(getMainCaroselItems).post(createMainCaroselItem);
router.route("/:id").patch(updateMainCarouselItem);

router.route("/uploadImage").post(uploadCarouselItemImage);

export default router;
