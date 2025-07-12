import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      min: 0,
      required: [true, "price is required"],
    },
    image: {
      type: String,
      required: [true, "image is required"],
    },

    image_path: {
      type: String,
      required: [true, "image is required"],
    },
    category: {
      type: String,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
