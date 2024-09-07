const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const profile = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);

    const { password, ...data } = user._doc;

    res.status(200).json({ message: "Authorized", data });
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = { profile };
