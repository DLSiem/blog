const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getCategories,
  getTags,
  getBlogsByAuthor,
} = require("../controllers/blogController");

router.get("/", getAllBlogs);
router.post("/create", createBlog);
router.get("/categories", getCategories);
router.get("/tags", getTags);
router.get("/:slug", getBlog);
router.get("/author/:authorId", getBlogsByAuthor);
router.patch("/:slug/update", updateBlog);
router.delete("/:id/delete", deleteBlog);
module.exports = router;
