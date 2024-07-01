import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.Userjwt;

  if (token) {
    try {

      const decoded = jwt.verify(token, process.env.JWT_CODE);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        res.status(403);
        return res.json({ success: false, message: "Not authorized, user not found" });
      }

      if (user.isBlocked === true) {
        res.status(403);
        return res.json({ success: false, message: "User is blocked" });
      }

      // Check user roles
      if (user.roles.includes('user')) {
        // Grant access for users with the 'user' role only
        req.user = user;
        next();
      } else {
        res.status(403);
        return res.json({ success: false, message: "Not authorized, insufficient role" });
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      return res.json({ success: false, message: "Not authorized, token failed" });
    }
  } else {
    res.status(401);
    return res.json({ success: false, message: "Not authorized, no token" });
  }
});

export { protect };
