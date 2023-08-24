import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";

import CartModel from "../models/Cart.js";
import OrderModel from "../models/Order.js";
import { BadRequestError } from "../errors/index.js";
import { checkPermissions } from "../utils/index.js";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "ThisIsClientSecret";
  return { client_secret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await OrderModel.find();
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "getSingleOrder" });
};

const getCurrentUserOrders = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "getCurrentUserOrders" });
};

const createOrder = async (req, res) => {
  const { cartId } = req.body;

  const cart = await CartModel.findOne({ _id: cartId });

  if (!cart) {
    throw new BadRequestError("Cart doesnot exist");
  }

  if (cart.cartItems.length === 0) {
    throw new BadRequest("No items in the cart");
  }

  const { tax, subTotal, total, cartItems, user } = cart;

  // const paymentIntent = fakeStripeApi(total, "INR");

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "INR",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const order = await OrderModel.create({
    tax,
    subTotal,
    total,
    cartItems,
    user,
    cartId,
    clientSecret: paymentIntent.client_secret,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await OrderModel.findOne({ _id: orderId });

  checkPermissions({ requestUser: req.user, resourseUserId: order.user });
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";

  order.save();

  res.status(StatusCodes.OK).json({ order });
};

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
