import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ msg: "unauthoerized no token" });
    }

    try {
      const plainToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const user = await User.findById(plainToken.userId);
      if (!user) {
        return res.status(401).json({ msg: "Unauthorize invalid token" });
      }
      req.user = user;
      next();
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        return res.status(401).json({ msg: "token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(400).json({ msg: "error occured on auth" });
  }
};

const adminRoute = (req, res, next) => {
  if (req.user && req.user.role == "admin") {
    next();
  } else {
    return res.status(401).json({ msg: "access denied - admin only" });
  }
};

export { protectRoute, adminRoute };
