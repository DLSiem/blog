const express = require("express");
const router = express.Router();
const {
  authenticate,
  refreshToken,
  protected,
} = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("Auth");
});

router.post("/signup", authenticate);
router.post("/login", authenticate);
router.post("/refreshtoken", refreshToken);
router.get("/protected", protected);
module.exports = router;
