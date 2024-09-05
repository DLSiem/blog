// User Signup
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/usermodel");

// User Signup
const signup = async (req, res) => {
  const { email, password } = req.body;
  // check is email or password is empty
  console.log(email, password);
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    console.log(email, password);
    return res.status(400).json({ message: "Email and Password is required" });
  }
  // check if email is valid
  if (!email.includes("@") || !email.includes(".")) {
    return res.status(400).json({ message: "Email is not valid" });
  }

  // check if password is less than 6 characters
  if (password.trim().length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  try {
    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    console.log("Hash", hashedPassword);

    // create new user
    const newUser = new User({ email, password });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Login

// User Logout

module.exports = { signup };
