import mongoose from "mongoose";

const ItemSchema = mongoose.Schema({
  url: {
    type: String,
    required: [true, "Please provide the video url"],
  },
  name: {
    type: String,
    required: [true, "Please provide video name"],
  },
  number: {
    type: Number,
    required: [true, "please provide the Video number"],
  },
});

const VideoSchema = mongoose.Schema({
  // url: {
  //   type: String,
  //   required: [true, "Please provide the video url"],
  // },

  section: {
    type: String,
    required: [true, "Please provide the section name"],
  },

  videos: [ItemSchema],

  number: {
    type: Number,
    required: [true, "please provide the Section number"],
  },

  general: {
    type: String,
  },

  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

const VideoModel = mongoose.model("Video", VideoSchema);

export default VideoModel;
