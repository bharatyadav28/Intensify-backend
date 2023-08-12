import mongoose from "mongoose";

const CurriculumSchema = mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  keyFeatures: {
    type: [String],
    required: true,
    default: ["Introduction"],
  },

  general: {
    type: Boolean,
    default: false,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

const CurriculumModel = mongoose.model("Curriculum", CurriculumSchema);

export default CurriculumModel;
