const express = require("express");
const router = express.Router();
const {
  authenticate,
  refreshToken,
  protected,
  sendEmailVerification,
  verifyEmailToken,
} = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("Auth");
});

router.post("/signup", authenticate);
router.post("/login", authenticate);
router.post("/google", authenticate);
router.post("/refreshtoken", refreshToken);
router.post("/sendemailverification", sendEmailVerification);
router.get("/verifyemailtoken", verifyEmailToken);
router.get("/protected", protected);

module.exports = router;
