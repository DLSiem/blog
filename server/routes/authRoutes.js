const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("Auth");
});

router.post("/signup", signup);

module.exports = router;
