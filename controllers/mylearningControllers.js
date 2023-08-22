import { StatusCodes } from "http-status-codes";

import OrderModel from "../models/Order.js";
import CourseModel from "../models/course/Course.js";

const getMyLearning = async (req, res) => {
  const userId = req.user.userId;

  const orders = await OrderModel.find({ user: userId });

  const coursesIds = [];
  orders.forEach((order) => {
    let cartItems = order.cartItems;

    cartItems.forEach((cartItem) => {
      coursesIds.push(cartItem.course);
    });
  });

  const purchasedCourses = [];

  for (let id of coursesIds) {
    const course = await CourseModel.findOne({ _id: id }).select(
      "_id image name netPrice actualPrice"
    );

    purchasedCourses.push(course);
  }

  res
    .status(StatusCodes.OK)
    .json({ courses: purchasedCourses, count: purchasedCourses.length });
};

export { getMyLearning };
