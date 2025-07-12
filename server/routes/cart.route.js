import express from "express";
import {
  addToCart,
  getProducts,
  emptyCart,
  updateQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";
const router = express.Router();

router.get("/", getProducts);
router.post("/", addToCart);
router.patch("/:id", updateQuantity);
router.delete("/", emptyCart);
router.delete("/:id", removeFromCart);
export default router;
