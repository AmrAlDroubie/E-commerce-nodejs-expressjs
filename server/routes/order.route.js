import express from "express";
import {
  createCheckooutSession,
  checkoutSuccess,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckooutSession);
router.post("/checkout-success", checkoutSuccess);
export default router;
