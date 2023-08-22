import mongoose from "mongoose";

const SingleCartItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide cart item name"],
  },
  image: {
    type: String,
    required: [true, "Please provide cart item image"],
  },
  price: {
    type: Number,
    required: [true, "Please provide cart item price"],
  },

  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: [true, "Please provide the course"],
  },
});

const CartSchema = mongoose.Schema(
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
    cartItems: [SingleCartItemSchema],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the user"],
    },
  },
  {
    timeStamps: true,
  }
);

const CartModel = mongoose.model("Cart", CartSchema);

export default CartModel;
