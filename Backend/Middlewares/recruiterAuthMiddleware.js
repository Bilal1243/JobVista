import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../Models/userModel.js";


const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.RecruiterJwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_CODE);

      const recruiter = await User.findById(decoded.recruiterId).select("-password");

      if (!recruiter) {
        res.status(400);
        return res.json({ message: "Not authorized, recruiter not found" });
      }

      if (recruiter.isBlocked) {
        res.status(400);
        return res.json({ message: "Recruiter is blocked" });
      }

      // Check if the recruiter has the 'recruiter' role
      if (recruiter.roles.includes('recruiter')) {
        req.recruiter = recruiter;
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
    return res.json({ message: "Not authorized, no token recruiter" });
  }
});

export { protect };
