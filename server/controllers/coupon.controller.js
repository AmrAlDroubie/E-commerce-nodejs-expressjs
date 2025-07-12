import Coupon from "../models/coupon.model.js";

const getCoupon = async (req, res) => {
  try {
    const user = req.user;
    const coupons = await Coupon.findOne({ userId: user.id, isActive: true });
    return res.json({ coupons });
  } catch (error) {
    console.log("Error in getCoupons error:", error.message);
    res.status(500).json({ msg: "Error in get coupons" });
  }
};

const checkCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const user = req.user;
    const coupon = await Coupon.findOne({ code: code, userId: user.id });
    if (!coupon) {
      return res.status(404).json({ msg: "Token not exist" });
    }

    if (checkCoupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.json({ msg: "Coupon is expired" });
    }

    return res.json({
      msg: "Coupon is Valid",
      code: coupon.code,
      discount: coupon.discount,
    });
  } catch (error) {
    console.log("Error in checkCoupon Error:", error.message);
    return res.status(500).json({ msg: "Error in checkCoupon" });
  }
};

export { getCoupon, checkCoupon };
