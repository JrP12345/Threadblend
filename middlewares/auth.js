import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Login First",
      });
    }

    const decoded = jwt.verify(token, "SECRETJADHU");

    if (!decoded._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token Structure",
      });
    }

    req.user = await User.findById(decoded._id);

    // Log the fact that the user is authenticated
    console.log("User is authenticatd:", req.user);

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid Token",
    });
  }
};
