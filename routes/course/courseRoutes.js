import express from "express";

import {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  uploadImage,
} from "../../controllers/course/courseController.js";
import {
  getAllCourseCurriculum,
  createCourseCurriculum,
} from "../../controllers/course/curriculumController.js";

import {
  getCourseOverview,
  createCourseOverview,
} from "../../controllers/course/overviewController.js";

import {
  getCourseAllFAQ,
  createCourseFAQ,
} from "../../controllers/course/FAQController.js";

const router = express.Router();

router.route("/").get(getAllCourses).post(createCourse);
router.route("/uploadImage").post(uploadImage);
router.route("/:id").get(getSingleCourse).patch(updateCourse);

// curriulum
router.route("/curriculums").post(createCourseCurriculum);
router.route("/curriculums/:id").get(getAllCourseCurriculum); // course id

// overview
router.route("/overview").post(createCourseOverview);
router.route("/overview/:id").get(getCourseOverview); // course id

// faq
router.route("/faq").post(createCourseFAQ);
router.route("/faq/:id").get(getCourseAllFAQ); // course id

export default router;
