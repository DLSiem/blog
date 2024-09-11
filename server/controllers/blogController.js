const Category = require("../models/categoryModel");
const Tag = require("../models/tagModel");
const Blog = require("../models/blogModel");

const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags, author, likes, status, views } =
      req.body;

    // convert tags to array
    let tagsArray = tags.split(",").map((tag) => tag.trim());

    // Step 1: Check if the category exists or create a new one
    let blogCategory = await Category.findOne({ name: category });
    if (!blogCategory) {
      blogCategory = new Category({ name: category });
      await blogCategory.save();
    }

    let tagObjectIds = [];
    // Step 2: Handle the tags (similar logic to Tag handling)
    for (let tagName of tagsArray) {
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
    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.log("Error creating blog", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    // get latest 10 blogs for pagination purposes
    const blogs = await Blog.find()
      .populate("category", "name")
      .populate("author", "username")
      .populate("tags", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // send only the title and the content, author name upto 100 characters
    const modifiedBlogs = blogs.map((blog) => {
      return {
        _id: blog._id,
        title: blog.title,
        content: blog.content.substring(0, 100),
        author: blog.author.username,
        slug: blog.slug,
      };
    });

    res.status(200).json(modifiedBlogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlog = async (req, res) => {
  const { slug } = req.params;
  try {
    const blog = await Blog.findOne({ slug })
      .populate("category", "name")
      .populate("author", "username")
      .populate("tags", "name");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

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

// get all categories list

const getCategories = async (req, res) => {
  try {
    const response = await Category.find();
    const categories = response;
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all tags list

const getTags = async (req, res) => {
  try {
    const response = await Tag.find();
    const tags = response;
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  getCategories,
  getTags,
};
