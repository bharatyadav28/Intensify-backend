import jwt from "jsonwebtoken";

const create_jwt = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
};

const attachCookiesToResponse = ({ res, user, refreshTokenString }) => {
  const accessTokenJWT = create_jwt({ user });
  const refreshTokenJWT = create_jwt({ user, refreshTokenString });

  const mintime = 1000 * 60 * 60 * 24;
  const maxtime = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + mintime),
    signed: true,
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + maxtime),
    signed: true,
  });

  // res.clearCookie("accessToken");
};

const verify_token = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export { create_jwt, verify_token, attachCookiesToResponse };
