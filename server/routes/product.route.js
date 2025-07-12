import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/uploadImage.middleware.js";

import {
  getAllFeaturedProducts,
  getAllProducts,
  createProduct,
  deleteProduct,
  getImage,
  getProductsByCategory,
  toggleFeaturedProduct,
  getRandomProducts,
} from "../controllers/product.controller.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getAllFeaturedProducts);
router.get("/images/:image", getImage);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRandomProducts);

// Create product
router.post(
  "/",
  protectRoute,
  adminRoute,
  upload.single("image"),
  createProduct
);
// Update featured status
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

// Delete Product
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
export default router;
