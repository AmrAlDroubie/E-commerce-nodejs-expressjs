import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3h",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeToken = async (refreshToken, userId) => {
  await redis.set(
    `refreshToken${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const checkExist = await User.findOne({ email });
    if (checkExist) {
      return res.status(400).json({ msg: "The user already exists" });
    }
    const user = await User.create({ email, password, name });
    const { accessToken, refreshToken } = generateToken(user._id);
    await storeToken(refreshToken, user._id);
    setCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateToken(user._id);
      await storeToken(refreshToken, user._id);
      setCookies(res, accessToken, refreshToken);
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ msg: "user not exists" });
    }
  } catch (error) {
    res.json({ msg: "error in login", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const plainToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    redis.del(`refreshToken${plainToken.userId}`);
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.json({ msg: "logged out sucessfuly " });
  } catch (error) {
    return res.status(500).json({ msg: "Error in logout", error });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ msg: "No refreshToken provided" });
    }

    const plainToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const accessToken = jwt.sign(
      { userId: plainToken.userId },
      process.env.ACCESS_TOKEN_SECRET
    );
    const storedToken = await redis.get(`refreshToken${plainToken.userId}`);
    if (refreshToken == storedToken) {
      const user = await User.findById(plainToken.userId);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ msg: "Token refreshed", user });
    } else {
      res.status(400).json({ msg: "invalid Token" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error in refresh token", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.log("Error in getProfile Error:", error.message);
    return res
      .status(500)
      .json({ msg: "internal error in getting the profile" });
  }
};

export { signup, login, logout, refreshToken, getProfile };
