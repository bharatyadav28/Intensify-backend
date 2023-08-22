import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

import CourseModel from "../models/course/Course.js";
import CartModel from "../models/Cart.js";
import { checkPermissions } from "../utils/index.js";

const getAllCarts = async (req, res) => {
  const carts = await CartModel.find();
  res.status(StatusCodes.OK).json({ carts });
};

const getSingleCart = async (req, res) => {
  const { id: cartId } = req.params;
  const cart = await CartModel.findOne({ _id: cartId });

  if (!cart) {
    throw new NotFoundError(`No cart with id ${cartId}`);
  }

  checkPermissions({ requestUser: req.user, resourseUserId: cart.user });

  res.status(StatusCodes.OK).json({ cart });
};

const getCurrentUserCart = async (req, res) => {
  const userId = req.user.userId;
  const cart = await CartModel.findOne({ user: userId });

  if (!cart) {
    throw new NotFoundError(`No cart found`);
  }

  res.status(StatusCodes.OK).json({ cart, count: cart.cartItems.length });
};

// add items to cart
const addToCart = async (req, res) => {
  const { tax, cartItem } = req.body;

  if (!cartItem) {
    throw new BadRequestError("No items provided");
  }
  if (!tax) {
    throw new BadRequestError("No tax provided.");
  }

  const userId = req.user.userId;

  // validate course details
  const course = await CourseModel.findOne({ _id: cartItem.course });
  if (!course) {
    throw new BadRequestError(`No course with id ${cartItem.course}`);
  }

  const { name, image, netPrice: price, _id: courseId } = course;
  const newCartItem = { name, image, price, course: courseId };

  const existingCart = await CartModel.findOne({ user: userId });

  const { cartItems, subTotal } = existingCart;

  const index = cartItems.findIndex(
    (item) => item.course.toString() === course._id.toString()
  );

  if (index > -1) {
    throw new BadRequestError("This item already exists in the cart");
  }

  //  add item and update other cart details
  const updatedCartItems = [...cartItems, newCartItem];
  const updatedSubTotal = Number(subTotal) + Number(price);
  const updatedTotal = updatedSubTotal + Number(tax);

  const cart = await CartModel.findOneAndUpdate(
    { _id: existingCart._id },
    {
      cartItems: updatedCartItems,
      subTotal: updatedSubTotal,
      total: updatedTotal,
      tax,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(StatusCodes.CREATED).json({ cart });
};

const deleteCartItem = async (req, res) => {
  const { id: itemId } = req.params;

  const cart = await CartModel.findOne({ user: req.user.userId });

  const existingItem = cart.cartItems.find(
    (item) => item.course.toString() === itemId
  );

  if (!existingItem) {
    throw new NotFoundError("Item doesnot exist in the cart");
  }

  //  filter the cart
  const cartItems = cart.cartItems.filter(
    (item) => item.course.toString() !== itemId
  );

  const subTotal = cart.subTotal - existingItem.price;
  let total = cart.total - existingItem.price;
  let tax = cart.tax;

  if (cartItems.length === 0) {
    tax = 0;
    total = 0;
  }

  const updatedCart = await CartModel.findOneAndUpdate(
    { _id: cart._id },
    {
      cartItems,
      subTotal,
      total,
      tax,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(StatusCodes.OK).json({ cart: updatedCart });
};

// clear cart
const clearCart = async (req, res) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user.userId },
    {
      tax: 0,
      subTotal: 0,
      total: 0,
      cartItems: [],
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(StatusCodes.OK).json({ cart });
};

export {
  getAllCarts,
  getSingleCart,
  getCurrentUserCart,
  addToCart,
  deleteCartItem,
  clearCart,
};
