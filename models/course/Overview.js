import mongoose from "mongoose";

const OverviewSchema = mongoose.Schema({
  highlights: {
    type: [String],
    required: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  targetAudience: {
    type: [String],
    required: true,
    // enum: {
    //   values: [
    //     "IoT Engineer",
    //     "Embedded System Engineer",
    //     "Network Engineer",
    //     "Firmware Developer",
    //     "Software Engineer",
    //   ],
    //   message: "${VALUE} is not supported",
    // },
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

const OverviewModel = mongoose.model("Overview", OverviewSchema);

export default OverviewModel;
