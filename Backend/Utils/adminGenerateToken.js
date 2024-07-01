import jwt from "jsonwebtoken";

const AdmingenarateToken = (res, adminId) => {
  console.log(adminId)
  const token = jwt.sign({ adminId }, process.env.JWT_CODE, {
    expiresIn: "30d",
  });

  res.cookie("Adminjwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default AdmingenarateToken;