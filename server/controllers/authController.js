// User Signup
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/usermodel");

// User Signup and Login
const authenticate = async (req, res) => {
  const { email, password, type } = req.body;
  console.log(req.body);

  console.log("Type", type);
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
    // for type === 'signup'

    let userId = null;

    if (type === "signup") {
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

      userId = newUser._id;
    } else if (type === "login") {
      // for type === 'login'

      // check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User does not exists" });
      }
      userId = user._id;
    }
    // create token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });

    // create refresh token
    const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "7d",
    });

    // store refresh token in httpOnly cookie and send it to client

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(201).json({ message: "Sign In successfully", token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// check for token and verify token

const protected = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // check if token is valid
    return res.status(200).json({ message: "Authorized" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token Expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token Invalid" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// refresh token

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh Token", refreshToken);
};

// User Logout

module.exports = { authenticate, protected, refreshToken };
