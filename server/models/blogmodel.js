const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

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

    // Store tags as an array of ObjectIds
    tags: {
      type: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
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
    comments: [],
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

blogSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = generateSlug(this.title);
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
