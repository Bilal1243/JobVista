import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Admin from "../Models/adminModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.Adminjwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_CODE);

      const admin = await Admin.findById(decoded.adminId).select("-password");

      if (!admin) {
        res.status(400);
        return res.json({ message: "Not authorized, admin not found" });
      }

      // Check if the admin has the 'admin' role
      if (admin.roles.includes('admin')) {
        req.admin = admin;
        next();
      } else {
        res.status(403);
        return res.json({ message: "Not authorized, insufficient role" });
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      return res.json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401);
    return res.json({ message: "Not authorized, no token admin" });
  }
});

export { protect };
