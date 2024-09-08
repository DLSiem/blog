const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/du0k3njhg/image/upload/v1725788607/Cloudinary-React/vdth7t5emrosvognxnxp.jpg",
    },
    slug: {
      type: String,
      unique: true,
    },

    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
