import { UnAuthorizedError } from "../errors/index.js";

const checkPermissions = ({ requestUser, resourseUserId }) => {
  if (requestUser.role === "admin") {
    return;
  }

  if (requestUser.userId === resourseUserId.toString()) {
    return;
  }

  throw new UnAuthorizedError("You are not authorised to access this page");
};

export default checkPermissions;
