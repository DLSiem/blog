const express = require("express");
const router = express.Router();

const { profile } = require("../controllers/userController");

router.get("/", profile);

module.exports = router;
