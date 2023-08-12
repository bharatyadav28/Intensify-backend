import express from "express";
import "dotenv/config";
import "express-async-errors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

import dbConnect from "./db/connect.js";
import CourseRouter from "./routes/course/courseRoutes.js";
import MainCarouselRouter from "./routes/mainCarouselRoutes.js";
import AuthRouter from "./routes/authRoutes.js";
import UserRouter from "./routes/userRoutes.js";

import pageNotFoundMiddleware from "./middlewares/pageNotFound.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";
import { getCurrentDirectory } from "./utils/index.js";

const app = express();
app.set("trust proxy", true);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

const __dirname = getCurrentDirectory(import.meta.url);
app.use(express.static(path.join(__dirname, "/public/build")));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECREt));

app.use("/api/v1/courses", CourseRouter);
app.use("/api/v1/main-carousel", MainCarouselRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "public", "build", "index.html"))
);

app.use(pageNotFoundMiddleware);
app.use(errorHandlerMiddleware);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

try {
  await dbConnect(process.env.MONGO_URL);
  console.log("Connected to database successfully.");
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, console.log(`Server started at http://localhost:${PORT}`));
} catch (error) {
  console.log("Database connectivity error :", error);
}
