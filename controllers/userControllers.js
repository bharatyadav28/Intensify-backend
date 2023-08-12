import { StatusCodes } from "http-status-codes";

const showCurrentUser = async (req, res) => {
  const user = req.user;
  return res.status(StatusCodes.OK).json({ user });
};

export { showCurrentUser };
