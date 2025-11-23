const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) return res.status(404).json("User not found");

    req.user = user; // full user object
    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};
