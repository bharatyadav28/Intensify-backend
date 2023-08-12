import mongoose from "mongoose";

const FAQSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
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

const FAQModel = mongoose.model("FAQ", FAQSchema);

export default FAQModel;
