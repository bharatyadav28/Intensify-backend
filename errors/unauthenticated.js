import { StatusCodes } from "http-status-codes";

import CustomError from "./custom-errors.js";

class UnauthenticatedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export default UnauthenticatedError;
