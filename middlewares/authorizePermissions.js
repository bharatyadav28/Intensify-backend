import { UnAuthorizedError } from "../errors/index.js";

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnAuthorizedError(
        "You are not authorized to access this route"
      );
    }
    next();
  };
};

export default authorizePermissions;
