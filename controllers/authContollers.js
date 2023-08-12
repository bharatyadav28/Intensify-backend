import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

import UserModel from "../models/User.js";
import TokenModel from "../models/Token.js";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";
import {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
} from "../utils/index.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  let role = "user";

  const isFirstUser = (await UserModel.countDocuments()) === 0;
  if (isFirstUser) {
    role = "admin";
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await UserModel.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  //  There a proxy between client and server
  const clientProtocol = req.get("x-forwarded-proto") || req.protocol;
  const clientHost = req.get("x-forwarded-host") || req.get("host");
  const origin = `${clientProtocol}://${clientHost}`;

  await sendVerificationEmail({ name, email, origin, verificationToken });

  res.status(StatusCodes.CREATED).json({
    user,
    msg: "Please check your email for verification ",
  });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;

  setTimeout(() => {}, 10000);
  if (!email || !verificationToken) {
    throw new BadRequestError("Please provide email and token");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verfication token is incorrect");
  }
  user.verificationToken = "";
  user.isVerified = true;
  user.verified = new Date(Date.now());

  user.save();

  // setTimeout(() => {
  //   return res
  //     .status(StatusCodes.OK)
  //     .json({ msg: "Verification of email is successfull" });
  // }, 3000);

  res
    .status(StatusCodes.OK)
    .json({ msg: "Verification of email is successfull" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please enter email and password");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new BadRequestError(`No user with email ${email}`);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Wrong email or password");
  }

  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your email");
  }

  const tokenUser = createTokenUser(user);

  // refreshToken string use to create actual refresh token(string+user)
  let refreshTokenString = "";

  // refresh token exists (String exists in the collection)
  const existingToken = await TokenModel.findOne({ user: user._id });
  if (existingToken) {
    refreshTokenString = existingToken.refreshTokenString;

    if (!existingToken.isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    attachCookiesToResponse({ res, user: tokenUser, refreshTokenString });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successfull", user: { name: user.name } });
  }

  //create new token
  refreshTokenString = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  await TokenModel.create({
    refreshTokenString,
    userAgent,
    ip,
    user: user._id,
  });

  attachCookiesToResponse({ res, user: tokenUser, refreshTokenString });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Login Successfull", user: { name: user.name } });
};

const logout = async (req, res) => {
  await TokenModel.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "token", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "token", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  // setTimeout(
  //   () => res.status(StatusCodes.OK).json({ msg: "Logout user" }),
  //   5000
  // );
  res.status(StatusCodes.OK).json({ msg: "Logout user" });
};

export { register, verifyEmail, login, logout };
