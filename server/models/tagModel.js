const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Enforce uniqueness for tags
    trim: true, // Remove any extra whitespace
  },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
