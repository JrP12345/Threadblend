import jwt from "jsonwebtoken";

export const sendCookie = (user, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: user._id }, "SECRETJADHU");
  res
    .status(statusCode)
    .cookie("token", token, { maxAge: 60 * 60 * 1000 })
    .json({ success: true, httpOnly: true, message });
};
