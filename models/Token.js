import mongoose from "mongoose";

const TokenSchema = mongoose.Schema({
  refreshTokenString: {
    type: String,
    required: true,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const TokenModel = mongoose.model("Token", TokenSchema);
export default TokenModel;
