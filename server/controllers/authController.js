// User Signup
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/usermodel");

// User Signup and Login
const authenticate = async (req, res) => {
  const { email, password, type } = req.body;

  // check is email or password is empty
  console.log(email, password);
  if (!email || !password || email.trim() === "" || password.trim() === "") {
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
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      userId = newUser._id;
    } else if (type === "login") {
      // for type === 'login'

      // check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User does not exists" });
      }

      // check if password is correct
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid Password" });
      }

      userId = user._id;
    }
    // create token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "20s",
    });

    // create refresh token
    const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH, {
      expiresIn: "7d",
    });

    // store refresh token in http-only cookie send to client side
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(201).json({ message: "Sign In successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
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
    jwt.verify(token, process.env.JWT_SECRET); // check if token is valid
    return res.status(200).json({ message: "Authorized" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token Expired", error: error.name });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Token Invalid", error: error.name });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// refresh token

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        {
          expiresIn: "20m",
        }
      );
      return res.status(200).json({ message: "Token Refreshed", token });
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// User Logout

module.exports = { authenticate, protected, refreshToken };
