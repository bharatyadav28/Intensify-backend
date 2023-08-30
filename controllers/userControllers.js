import { StatusCodes } from "http-status-codes";

import UserModel from "../models/User.js";

const showCurrentUser = async (req, res) => {
  const user = req.user;
  return res.status(StatusCodes.OK).json({ user });
};

const getAllUsers = async (req, res) => {
  const users = await UserModel.find();
  return res.status(StatusCodes.OK).json({ users, count: users.length });
};

export { showCurrentUser, getAllUsers };
