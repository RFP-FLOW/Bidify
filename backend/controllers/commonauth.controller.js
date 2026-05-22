import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Vendor from "../models/Vendor.js";

export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_SECRET
    );

    // FIND USER OR VENDOR
    let user =
      (await User.findById(decoded._id)) ||
      (await Vendor.findById(decoded._id));

    if (!user) {
      return res.status(403).json({
        message: "User not found",
      });
    }

    // MATCH DB TOKEN
    if (user.refreshToken !== token) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    // CREATE NEW ACCESS TOKEN
    const accessToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.json({
      accessToken,
    });

  } catch (error) {
    res.status(403).json({
      message: "Invalid refresh token",
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      const decoded = jwt.decode(token);

      let user =
        (await User.findById(decoded?._id)) ||
        (await Vendor.findById(decoded?._id));

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken");

    res.json({
      message: "Logged out successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Logout failed",
    });
  }
};