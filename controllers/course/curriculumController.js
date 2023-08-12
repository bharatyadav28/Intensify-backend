import { StatusCodes } from "http-status-codes";

import CurriculumModel from "../../models/course/Curriculum.js";
import { BadRequestError, NotFoundError } from "../../errors/index.js";

// for specific course
const getAllCourseCurriculum = async (req, res) => {
  const { id: courseId } = req.params;
  const curriculums = await CurriculumModel.find({ course: courseId });
  return res.status(StatusCodes.OK).json({ curriculums });
};

const createCourseCurriculum = async (req, res) => {
  const curriculum = await CurriculumModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ curriculum });
};

export { getAllCourseCurriculum, createCourseCurriculum };
