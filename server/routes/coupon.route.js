import express from "express";
import { getCoupon, checkCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", getCoupon);
router.get("/check-coupon", checkCoupon);

export default router;
