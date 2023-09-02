import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

import UserModel from "../models/User.js";
import TokenModel from "../models/Token.js";
import CartModel from "../models/Cart.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/index.js";
import {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
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
  let clientProtocol = req.get("x-forwarded-proto");
  let clientHost = req.get("x-forwarded-host");

  if (clientProtocol === "http") {
    clientHost = "localhost:3000";
  }
  if (clientProtocol === "https") {
    clientHost = "intensify-jet.vercel.app";
  }

  const origin = `${clientProtocol}://${clientHost}`;

  // console.log("hp", clientProtocol, clientHost, req.get("host"));

  await sendVerificationEmail({ name, email, origin, verificationToken });

  res.status(StatusCodes.CREATED).json({
    user,
    msg: "Please check your email for verification ",
  });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;

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

  // creating empty cart
  await CartModel.create({
    tax: 0,
    subTotal: 0,
    total: 0,
    cartItems: [],
    user: user._id,
  });

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

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide email.");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundError(`No user with email ${email}`);
  }

  const passwordToken = crypto.randomBytes(70).toString("hex");

  let clientProtocol = req.get("x-forwarded-proto");
  let clientHost = req.get("x-forwarded-host");
  // console.log(clientProtocol, clientHost);

  if (clientProtocol === "http") {
    clientHost = "localhost:3000";
  }
  if (clientProtocol === "https") {
    clientHost = "intensify-jet.vercel.app";
  }

  const origin = `${clientProtocol}://${clientHost}`;
  await sendResetPasswordEmail({
    name: user.name,
    email,
    origin,
    passwordToken,
  });

  const tenMinutes = 1000 * 60 * 10;
  const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

  user.passwordToken = createHash(passwordToken);
  user.passwordTokenExpirationDate = passwordTokenExpirationDate;
  user.save();

  return res.status(StatusCodes.OK).json({
    msg: "Please check your email for reset password link.",
    passwordToken,
  });
};

const resetPasword = async (req, res) => {
  const { email, password, passwordToken } = req.body;

  if (!email || !password || !passwordToken) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await UserModel.findOne({
    email,
    passwordToken: createHash(passwordToken),
  });
  if (!user) {
    throw new NotFoundError(`Invalid token`);
  }

  const now = new Date(Date.now());

  if (user.passwordTokenExpirationDate <= now) {
    throw new BadRequestError("Link expired");
  }

  user.passwordToken = null;
  user.passwordTokenExpirationDate = null;
  user.password = password;
  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Password reset successfully" });
};

export { register, verifyEmail, login, logout, forgotPassword, resetPasword };
