import { StatusCodes } from "http-status-codes";

import FAQModel from "../../models/course/FAQ.js";

// for specific course
const getCourseAllFAQ = async (req, res) => {
  const { id: courseId } = req.params;
  const faq = await FAQModel.find({ course: courseId });
  // .populate({
  //   path: "course",
  //   select: "name",
  // });

  return res.status(StatusCodes.OK).json({ faq });
};

const createCourseFAQ = async (req, res) => {
  const faq = await FAQModel.create(req.body);
  return res.status(StatusCodes.CREATED).json({ faq });
};

export { getCourseAllFAQ, createCourseFAQ };
