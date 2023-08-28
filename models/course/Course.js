import mongoose from "mongoose";

const CourseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
    },
    desc: {
      type: String,
      trim: true,
      required: true,
      maxLength: 1000,
    },
    image: {
      type: String,
      required: true,
    },
    general: {
      type: String,
    },
    actualPrice: {
      type: Number,
      required: true,

      default: 0,
    },
    netPrice: {
      type: Number,
      required: true,

      default: 0,
    },
    duration: {
      type: String,
      trim: true,
      required: true,
    },
    enrolled: {
      type: Number,

      default: 0,
    },
    languages: {
      type: [String],
      default: ["English"],
      required: true,
    },
    skills: {
      type: String,
      trim: true,
      required: true,
      enum: {
        values: ["All level", "Begginner level", "Advance Level"],
        message: "{VALUE} is not supported",
      },
    },
    certificate: {
      type: Boolean,
    },
    relatedName: {
      type: String,
    },
    tutor: {
      name: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

CourseSchema.virtual("overview", {
  ref: "Overview",
  localField: "_id",
  foreignField: "course",
  // match: { general: true },
  justOne: true,
});
CourseSchema.virtual("FAQ", {
  ref: "FAQ",
  localField: "_id",
  foreignField: "course",
});
CourseSchema.virtual("curriculum", {
  ref: "Curriculum",
  localField: "_id",
  foreignField: "course",
});

const CourseModel = mongoose.model("Course", CourseSchema);

export default CourseModel;
