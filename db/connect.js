import mongoose from "mongoose";

const dbConnect = async (url) => {
  return mongoose.connect(url);
};

export default dbConnect;
