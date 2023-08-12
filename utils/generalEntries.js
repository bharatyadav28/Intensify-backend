import OverviewModel from "../models/course/Overview.js";
import CurriculumModel from "../models/course/Curriculum.js";
import FAQModel from "../models/course/FAQ.js";

// get all general overviews
const getGeneralOverview = async () => {
  const overview = await OverviewModel.findOne({ general: true });
  return overview;
};

const getGeneralCurriculums = async () => {
  const curriculum = await CurriculumModel.find({ general: true });

  return curriculum;
};

const getGeneralFAQ = async () => {
  const faq = await FAQModel.find({ general: true });

  return faq;
};

export { getGeneralCurriculums, getGeneralOverview, getGeneralFAQ };
