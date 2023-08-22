import mongoose from "mongoose";

const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: [true, "Please provide the tax"],
    },

    subTotal: {
      type: Number,
      required: [true, "Please provide subtotal"],
    },
    total: {
      type: Number,
      required: [true, "Please provide total"],
    },
    cartItems: [],

    status: {
      type: "String",
      enum: {
        values: ["pending", "failed", "paid", "delivered", "cancelled"],
        message: "{VALUE} is not supported",
      },
      default: "pending",
    },

    clientSecret: {
      type: String,
      required: true,
    },

    paymentIntentId: {
      type: String,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user"],
    },
    cartId: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: [true, "Please provide the cart id"],
    },
  },
  {
    timeStamps: true,
  }
);

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;
