const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

router.get("/", getAllBlogs);
router.post("/create", createBlog);
router.get("/:slug", getBlog);
router.patch("/:id/update", updateBlog);
router.delete("/:id/delete", deleteBlog);
module.exports = router;
