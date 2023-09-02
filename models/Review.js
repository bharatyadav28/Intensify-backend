import mongoose from "mongoose";
import CourseModel from "./course/Course.js";

const ReviewSchema = mongoose.Schema({
  ratings: {
    type: Number,
    required: [true, "Please provide ratings"],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, "Please provide comment"],
  },

  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },

  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

// ReviewSchema.index({ user: 1, course: 1 }, { unique: true });

ReviewSchema.statics.aggregateResult = async function (courseId) {
  const result = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: null,
        averageRatings: { $avg: "$ratings" },
        noOfReviews: { $sum: 1 },
      },
    },
  ]);

  const course = await CourseModel.findOne({ _id: courseId });
  course.averageRatings = Math.ceil(result[0].averageRatings || 0);
  course.noOfReviews = result[0].noOfReviews || 0;
  await course.save();
};

ReviewSchema.post("save", async function () {
  await this.constructor.aggregateResult(this.course);
});

const ReviewModel = mongoose.model("Review", ReviewSchema);

export default ReviewModel;
