import { UnauthenticatedError } from "../errors/index.js";
import { verify_token, attachCookiesToResponse } from "../utils/index.js";
import TokenModel from "../models/Token.js";

const authentication = async (req, res, next) => {
  // const authHeader = req.headers["authorization"];

  // if (!authHeader.startsWith("Bearer ")) {
  //   throw new UnauthenticatedError("No token found");
  // }

  // const incomingToken = authHeader.split(" ")[1];
  // console.log(incomingToken);

  const { accessToken, refreshToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = verify_token(accessToken);

      req.user = payload.user;
      return next();
    }

    const payload = verify_token(refreshToken);
    const { user, refreshTokenString } = payload;

    const token = await TokenModel.findOne({
      user: user.userId,
      refreshTokenString,
    });

    if (!token || !token.isValid) {
      throw new UnauthenticatedError("Invalid credentials");
    }
    attachCookiesToResponse({ res, user, refreshTokenString });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

export default authentication;
