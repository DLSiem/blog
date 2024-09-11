// User Signup

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

// User Signup and Login
const authenticate = async (req, res) => {
  const { email, password, type } = req.body;

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
    let user = null;

    if (type === "signup") {
      // check if user already exists

      const findUser = await User.findOne({ email });
      if (findUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      userId = newUser._id;
      if (newUser && newUser._doc) {
        const { password, ...userData } = newUser._doc;
        user = userData;
      }
    } else if (type === "login") {
      // for type === 'login'

      // check if user exists
      const findUser = await User.findOne({ email });
      if (!findUser) {
        return res.status(400).json({ message: "User does not exists" });
      }

      // check if password is correct
      const validPassword = await bcrypt.compare(password, findUser.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Invalid Password" });
      }

      userId = findUser._id;
      if (findUser && findUser._doc) {
        const { password, ...userData } = findUser._doc;
        user = userData;
      }
    }
    // create token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "20m",
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
    res.status(201).json({ message: "Sign In successfully", token, user });
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
    // if valid return authorized message and user data

    const { userId } = jwt.decode(token);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { password, ...userData } = user._doc;
    return res.status(200).json({ message: "Authorized", data: userData });
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
  try {
    if (refreshToken) {
      jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
      const { userId } = jwt.decode(refreshToken);
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "20m",
      });
      const { password, ...userData } = user._doc;
      return res
        .status(200)
        .json({ message: "Token Refreshed", token, user: userData });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Logout

module.exports = { authenticate, protected, refreshToken };
