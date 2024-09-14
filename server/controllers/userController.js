const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

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

// update users profile
const userUpdate = async (req, res) => {
  try {
    const updateData = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = decoded.userId;

    const user = await User.findByIdAndUpdate(userId, {
      $set: updateData,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { password, ...data } = user._doc;
    return res
      .status(200)
      .json({ message: "Updated Successfully", user: data });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error ww" });
  }
};

module.exports = { profile, userUpdate };
