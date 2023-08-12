import { StatusCodes } from "http-status-codes";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import CourseModel from "../../models/course/Course.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import getCurrentDirectory from "../../utils/currentDirectory.js";
import {
  getGeneralCurriculums,
  getGeneralOverview,
  getGeneralFAQ,
} from "../../utils/generalEntries.js";

const getAllCourses = async (req, res) => {
  const { search, sort } = req.query;

  const queryObject = {};
  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  let result = CourseModel.find(queryObject);

  // .populate({
  //   path: "overview",
  //   // select: "highlights requirements",
  // });
  // .populate({
  //   path: "FAQ",
  // })
  // .populate({
  //   path: "curriculum",
  // });

  if (sort && sort === "latest") {
    result.sort("createdAt");
  }
  if (sort && sort === "oldest") {
    result.sort("-createdAt");
  }

  if (sort && sort === "a-z") {
    result.sort("name");
  }
  if (sort && sort === "z-a") {
    result.sort("-name");
  }
  if (sort && sort === "ascPrice") {
    result.sort("netPrice");
  }

  if (sort && sort === "descPrice") {
    result.sort("-netPrice");
  }

  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const skip = (page - 1) * limit;

  // result = result.skip(skip).limit(limit);

  const fetchedCourses = await result;
  const courses = fetchedCourses.slice(skip, skip + limit);

  // setTimeout(
  //   () =>
  //     res.status(StatusCodes.OK).json({
  //       courses,
  //       count: courses.length,
  //       totalItems: fetchedCourses.length,
  //     }),
  //   1000
  // );

  return res.status(StatusCodes.OK).json({
    courses,
    count: courses.length,
    totalItems: fetchedCourses.length,
  });
};

const getSingleCourse = async (req, res) => {
  const { id: courseId } = req.params;

  const course = await CourseModel.findOne({ _id: courseId })
    .populate("overview")
    .populate("FAQ")
    .populate("curriculum");

  if (!course) {
    throw new NotFoundError(`No course with id ${courseId}`);
  }

  if (course.overview === null) {
    course.overview = await getGeneralOverview();
  }
  if (course.curriculum.length < 1) {
    course.curriculum = await getGeneralCurriculums();
  }
  if (course.FAQ.length < 1) {
    course.FAQ = await getGeneralFAQ();
  }

  return res.status(StatusCodes.OK).json({ course });
};

const createCourse = async (req, res) => {
  const course = await CourseModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ course });
};

const updateCourse = async (req, res) => {
  const { id: courseId } = req.params;
  const course = await CourseModel.findOneAndUpdate(
    { _id: courseId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!course) {
    throw new NotFoundError(`No course with id ${courseId}`);
  }

  return res.status(StatusCodes.OK).json({ course });
};

const uploadImage = async (req, res) => {
  const file = req.files;
  const __dirname = getCurrentDirectory(import.meta.url);

  if (!file) {
    throw new BadRequestError("Please upload a file");
  }

  const courseImage = req.files.image;
  if (!courseImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload an image");
  }

  const maxImageSize = 1024 * 1024;
  if (courseImage.size > maxImageSize) {
    throw new BadRequestError(`Image size should be less than ${maxImageSize}`);
  }

  // courseImage.mv(
  //   path.join(__dirname, "../../public/temp/", `${courseImage.name}`)
  // );

  const result = await cloudinary.uploader.upload(courseImage.tempFilePath, {
    use_filename: true,
    folder: "Intensify/Courses",
  });

  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.CREATED).json({ image: result.secure_url });
};

export {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  uploadImage,
};
