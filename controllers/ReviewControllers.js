import { StatusCodes } from "http-status-codes";

import ReviewModel from "../models/Review.js";
import CourseModel from "../models/course/Course.js";
import UserModel from "../models/User.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const getAllReviews = async (req, res) => {
  const reviews = await ReviewModel.find();
  return res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const createReview = async (req, res) => {
  const { course: courseId } = req.body;
  const userId = req.user.userId;

  const isValidProduct = await CourseModel.findOne({ _id: courseId });
  if (!isValidProduct) {
    throw new NotFoundError(`No product with id ${courseId}`);
  }

  const alreadySubmitted = await ReviewModel.findOne({
    course: courseId,
    user: userId,
  });
  if (alreadySubmitted) {
    throw new BadRequestError("Already submitted review for this product");
  }

  req.body.user = userId;
  const review = await ReviewModel.create(req.body);

  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "Review submitted successfully" });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await ReviewModel.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError(`No review with id ${reviewId}`);
  }
  return res.status(StatusCodes.OK).json({ review });
};

const getSingleCoursetReviews = async (req, res) => {
  const { id: courseId } = req.params;
  const reviews = await ReviewModel.find({ course: courseId });
  return res.status(StatusCodes.OK).json({ reviews });
};

const getTopReviews = async (req, res) => {
  const reviews = await ReviewModel.find().sort({ ratings: -1 }).limit(8);

  let reviewDetails = [];
  for (let review of reviews) {
    const user = await UserModel.findOne({ _id: review.user });

    const newData = {
      ratings: review.ratings,
      comment: review.comment,
      userName: user.name,
    };
    reviewDetails.push(newData);
  }

  return res
    .status(StatusCodes.OK)
    .json({ reviews: reviewDetails, count: reviews.length });
};

const hasAlreadySubmitted = async (req, res) => {
  const userId = req.user.userId;
  const courses = await CourseModel.find().select("_id");
  const courseIds = [];

  courses.forEach((course) => courseIds.push(course._id));

  let submitFlag = false;

  for (let id of courseIds) {
    const alreadySubmitted = await ReviewModel.findOne({
      course: id,
      user: userId,
    });
    if (alreadySubmitted) {
      submitFlag = true;
      break;
    }
  }

  return res.status(StatusCodes.OK).json({ courseIds, submitFlag });
};

export {
  getAllReviews,
  createReview,
  getSingleReview,
  getSingleCoursetReviews,
  getTopReviews,
  hasAlreadySubmitted,
};
