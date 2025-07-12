import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import orderRouter from "./routes/order.route.js";
import couponRouter from "./routes/coupon.route.js";
import { connectDB } from "./lib/connect.js";
import cookieParser from "cookie-parser";

import cors from "cors";
import { protectRoute } from "./middleware/auth.middleware.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", protectRoute, cartRouter);
app.use("/api/coupons", protectRoute, couponRouter);
app.use("/api/payment", protectRoute, orderRouter);
app.get("/test", (req, res) => {
  return res.json(req.body);
});
connectDB().then(() => {
  app.listen(port, async () => {
    console.log("Server in running on ", port);
  });
});
