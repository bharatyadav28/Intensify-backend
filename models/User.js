import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide your name"],
    minLength: [3, "Name length should be less than 3 characters"],
    maxLength: 50,
  },

  email: {
    type: String,
    trim: true,
    required: [true, "Please provide your email"],
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        // return validator.isEmail(v);
      },
      message: "Please provide a valid email address",
    },
    // match: [
    //   /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
    //   "Please provide a valid email address",
    // ],
    unique: true,
  },

  password: {
    type: String,
    trim: true,
    required: [true, "Please provide your Password"],
    minLength: [6, "Password length should not be less than 6"],
  },

  role: {
    type: String,
    trim: true,
    enum: {
      values: ["admin", "instructor", "user"],
      message: "{VALUE} is not supported",
    },
    default: "user",
  },

  verificationToken: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verified: {
    type: Date,
  },
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

// Pre save hook
UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths(), this.isModified("password"));
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  this.password = await bcrypt.hash(this.password, salt);
});

// compare hashed password with entered password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const UserModel = mongoose.model("User", UserSchema);

// UserModel.dropIndex("email");

export default UserModel;
