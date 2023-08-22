import express from "express";

import {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} from "../controllers/OrderControllers.js";
import authentication from "../middlewares/authentication.js";

const router = express.Router();

router.route("/").get(getAllOrders).post(authentication, createOrder);

router.route("/showMyOrders").get(getCurrentUserOrders);

router.route("/:id").get(getSingleOrder).patch(authentication, updateOrder);

export default router;
