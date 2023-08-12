import MainCarouselModel from "../models/MainCarousel.js";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { StatusCodes } from "http-status-codes";
import { getCurrentDirectory } from "../utils/index.js";
import { BadRequestError } from "../errors/index.js";

const createMainCaroselItem = async (req, res) => {
  const carouselItem = await MainCarouselModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ carouselItem });
};

const getMainCaroselItems = async (req, res) => {
  const carouselItems = await MainCarouselModel.find();
  return res.status(StatusCodes.OK).json({ carouselItems });
};

const updateMainCarouselItem = async (req, res) => {
  const { id: itemId } = req.params;
  const carouselItem = await MainCarouselModel.findOneAndUpdate(
    { _id: itemId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!carouselItem) {
    throw new NotFoundError(`No carouselItem with id ${itemId}`);
  }
  return res.status(StatusCodes.OK).json({ carouselItem });
};

const uploadCarouselItemImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("Please upload a file");
  }

  const carouselImage = req.files.image;
  if (!carouselImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload an image");
  }

  // const __dirname = getCurrentDirectory(import.meta.url);
  // carouselImage.mv(
  //   path.join(__dirname, `../public/temp/main-carousel/${carouselImage.name}`)
  // );
  const result = await cloudinary.uploader.upload(carouselImage.tempFilePath, {
    use_filename: true,
    folder: "Intensify/MainCarousel",
  });

  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.CREATED).json({ image: result.secure_url });
};

export {
  createMainCaroselItem,
  getMainCaroselItems,
  updateMainCarouselItem,
  uploadCarouselItemImage,
};
