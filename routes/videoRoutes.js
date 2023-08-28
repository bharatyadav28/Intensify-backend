import express from "express";

import {
  getCourseVideos,
  createCourseVideo,
  uploadVideo,
} from "../controllers/videoControllers.js";
import authentication from "../middlewares/authentication.js";
import authorizePermissions from "../middlewares/authorizePermissions.js";

const router = express.Router();

router
  .route("/")
  .post(authentication, authorizePermissions("admin"), createCourseVideo);
router
  .route("/upload-video")
  .post(authentication, authorizePermissions("admin"), uploadVideo);
router.route("/:id").get(authentication, getCourseVideos);

export default router;
