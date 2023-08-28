import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { BadRequestError, UnAuthorizedError } from "../errors/index.js";
import VideoModel from "../models/Video.js";
import OrderModel from "../models/Order.js";

const getCourseVideos = async (req, res) => {
  const { id: courseId } = req.params;
  const userId = req.user.userId;

  let courseVideos = await VideoModel.find({ course: courseId });

  const orders = await OrderModel.find({ user: userId, status: "paid" });

  const coursesIds = [];
  orders.forEach((order) => {
    let cartItems = order.cartItems;
    cartItems.forEach((cartItem) => {
      coursesIds.push(cartItem.course.toString());
    });
  });

  if (!coursesIds.includes(courseId)) {
    throw new UnAuthorizedError({ msg: "Purchase the course first" });
  }

  if (courseVideos.length === 0) {
    courseVideos = await VideoModel.find({ general: true });
  }
  return res.status(StatusCodes.OK).json({ courseVideos });
};

const createCourseVideo = async (req, res) => {
  const courseVideo = await VideoModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ courseVideo });
};

const uploadVideo = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No files found");
  }

  const video = req.files.video;
  const isVideo = video.mimetype.startsWith("video");
  if (!isVideo) {
    throw new BadRequestError("No video found.");
  }

  const result = await cloudinary.uploader.upload(video.tempFilePath, {
    resource_type: "video",
    use_filename: true,
    folder: "Intensify/Videos",
  });

  fs.unlinkSync(req.files.video.tempFilePath);

  res.status(StatusCodes.OK).json({ video: result.secure_url });
};

export { createCourseVideo, uploadVideo, getCourseVideos };
