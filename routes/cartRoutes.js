import express from "express";

import authentication from "../middlewares/authentication.js";
import authorizePermissions from "../middlewares/authorizePermissions.js";

import {
  getAllCarts,
  getSingleCart,
  getCurrentUserCart,
  addToCart,
  deleteCartItem,
  clearCart,
} from "../controllers/CartControllers.js";

const router = express.Router();

router
  .route("/")
  .get(authentication, authorizePermissions("admin"), getAllCarts)
  .post(authentication, addToCart);

router.route("/showMyCart").get(authentication, getCurrentUserCart);

router.route("/clearCart").patch(authentication, clearCart);

router
  .route("/:id")
  .get(authentication, getSingleCart)
  .delete(authentication, deleteCartItem);

export default router;
