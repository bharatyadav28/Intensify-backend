import { StatusCodes } from "http-status-codes";

import OverviewModel from "../../models/course/Overview.js";

// for specific course
const getCourseOverview = async (req, res) => {
  const { id: courseId } = req.params;
  const overview = await OverviewModel.find({ course: courseId });
  return res.status(StatusCodes.OK).json({ overview });
};

const createCourseOverview = async (req, res) => {
  const overview = await OverviewModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ overview });
};

export { getCourseOverview, createCourseOverview };
