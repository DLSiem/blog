const Blog = require("../models/blogModel");
const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");

const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags, author, likes, status, views } =
      req.body;

    console.log("req.body", req.body);

    // Step 1: Check if the category exists or create a new one
    let blogCategory = await Category.findOne({ name: category });
    if (!blogCategory) {
      blogCategory = new Category({ name: category });
      await blogCategory.save();
    }

    let tagObjectIds = [];
    // Step 2: Handle the tags (similar logic to Tag handling)
    for (let tagName of tags) {
      let tag = await Tag.findOne({ name: tagName });
      if (!tag) {
        tag = new Tag({ name: tagName });
        await tag.save();
      }
      tagObjectIds.push(tag._id);
    }

    // Step 3: Create the blog post
    const newBlog = new Blog({
      title,
      content,
      category: blogCategory._id, // Store category ObjectId
      tags: tagObjectIds, // Store array of tag ObjectIds
      author,
      likes: likes || 0,
      status: status || "draft",
      views: views || 0,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.log("Error creating blog", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("category", "name") // Populate category field with only the name
      .populate("tags", "name") // Populate tags as well
      .populate("imageUrl"); // Populate image field with only the url
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id)
      .populate("category", "name")
      .populate("tags", "name")
      .populate("image", "url");
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  // delete blog
  try {
    await Blog.findByIdAndDelete(id);
    res.status(204).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBlog, getAllBlogs, getBlog, updateBlog, deleteBlog };
