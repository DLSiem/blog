const { sendEmail } = require("./mailController");
const nodemailer = require("nodemailer");
const { authenticator, totp } = require("otplib");

authenticator.options = { step: 120, window: 1 }; // 3 minutes valid otp
totp.options = { step: 120, window: 1 }; // 2 minutes valid otp for login otp

// User Signup
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/userModel");

// User Signup and Login
const authenticate = async (req, res) => {
  const { email, password, type, imageUrl, username } = req.body;

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

    if (type === "google") {
      const findUser = await User.findOne({ email });

      if (findUser) {
        userId = findUser._id;
        if (findUser && findUser._doc) {
          const { password, ...userData } = findUser._doc;
          user = userData;
        }
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
          email,
          password: hashedPassword,
          profilePicture: imageUrl,
          username,
        });

        await newUser.save();

        userId = newUser._id;
        if (newUser && newUser._doc) {
          const { password, ...userData } = newUser._doc;
          user = userData;
        }
      }
    }

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

// email verification

const sendEmailVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    // generate token

    const verifyEmailToken = authenticator.generate(process.env.OTP_SECRET);

    // create test email account
    let testAccount = await nodemailer.createTestAccount();

    if (!testAccount) {
      console.log("Internal Server Error");
      return { message: "Internal Server Error" };
    }
    console.log("testAccount", testAccount);

    // create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // message object

    const verifyEmailUrl = `http://localhost:5173/auth/emailverifymessage?token=${verifyEmailToken}&userId=${user._id}`;

    let message = {
      from: `Sender <${testAccount.user}>`,
      to: `Receiver <${email}>`,
      subject: "Email Verification",
      text: "Please verify your email by clicking the link below.",
      html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              color: #333333;
          }
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
              text-align: center;
              padding: 20px;
              background-color: #007bff;
              color: #ffffff;
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
          }
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
          .content {
              padding: 20px;
              text-align: center;
          }
          .content p {
              font-size: 18px;
              margin: 20px 0;
          }
          .verify-button {
              display: inline-block;
              padding: 15px 25px;
              background-color: #28a745;
              color: #ffffff;
              text-decoration: none;
              font-size: 18px;
              border-radius: 5px;
              margin-top: 20px;
              transition: background-color 0.3s ease;
          }
          .verify-button:hover {
              background-color: #218838;
          }
          .footer {
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #777777;
          }
      </style>
  </head>
  <body>

      <div class="email-container">
          <div class="header">
              <h1>Email Verification</h1>
          </div>

          <div class="content">
              <p>Hello,</p>
              <p>Thank you for registering! Please click the button below to verify your email address and complete your registration.</p>
              <a href="${verifyEmailUrl}" class="verify-button">Verify Email</a>
              <p>If you didn’t create an account, please ignore this email.</p>
          </div>

          <div class="footer">
              <p>&copy; 2024 Your Website. All rights reserved.</p>
          </div>
      </div>

  </body>
  </html>
  `,
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(message);

    if (!info) {
      return { message: "Internal Server Error" };
    }

    console.log("Message sent: %s", info.messageId);

    console.log(
      "Preview URL: %s",
      nodemailer.getTestMessageUrl(info),
      verifyEmailToken
    );

    return res
      .status(200)
      .json({ message: "Email Sent", info, verifyEmailToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyEmailToken = async (req, res) => {
  try {
    const { token, userId } = req.query;
    console.log("token", token);
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    authenticator.verify({
      token,
      secret: process.env.OTP_SECRET,
    });
    await User.findByIdAndUpdate(userId, {
      emailVerified: true,
    }).catch((error) => {
      console.log(error);
      return res.status(500).json({ message: "Coundn't update user!" });
    });
    return res.status(200).json({ message: "Email Verified" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const otpLogin = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = totp.generate(process.env.TOTP_SECRET);

    // create test email account
    let testAccount = await nodemailer.createTestAccount();

    if (!testAccount) {
      console.log("Internal Server Error");
      return { message: "Internal Server Error" };
    }
    console.log("testAccount", testAccount);

    // create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // message object

    let message = {
      from: `Sender <${testAccount.user}>`,
      to: `Receiver <${email}>`,
      subject: "Email Verification",
      text: "Please verify your email by clicking the link below.",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #333;
            letter-spacing: 1px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #777;
        }
        .footer p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>OTP Verification</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>Here is your One-Time Password (OTP) for verification:</p>
            <div class="otp-code">${otp}</div>
            <p>This OTP is valid for the next 5 minutes. Please use it to complete your verification process.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

  `,
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(message);

    if (!info) {
      return { message: "Internal Server Error" };
    }

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info), otp);

    return res.status(200).json({ message: "Email Sent", info, otp });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const otpVerify = async (req, res) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ message: "OTP and Email is required" });
  }
  try {
    const isValid = totp.verify({
      token: otp,
      secret: process.env.TOTP_SECRET,
    });

    console.log("isValid", isValid);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const { password, ...userData } = user._doc;

    const userId = user._id;
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
    res.status(201).json({ message: "OTP Verified", token, user: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  authenticate,
  protected,
  refreshToken,
  sendEmailVerification,
  verifyEmailToken,
  otpLogin,
  otpVerify,
};
