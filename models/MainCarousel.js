import mongoose from "mongoose";

const MainCarouselSchema = mongoose.Schema({
  image: {
    type: String,
    required: [true, "Please upload an image."],
  },
  caption: {
    type: String,
    required: [true, "Please provide a caption."],
  },
  desc: {
    type: String,
    required: [true, "Please upload a desciption."],
  },
});

const MainCarouselModel = mongoose.model("MainCarousel", MainCarouselSchema);

export default MainCarouselModel;
