const express = require("express");
const router = express.Router();

const { profile, userUpdate } = require("../controllers/userController");

router.get("/", profile);
router.patch("/update", userUpdate);

module.exports = router;
