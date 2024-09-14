const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// set default username to email if username is not provided and add some random numbers to make it unique
userSchema.pre("save", function (next) {
  if (!this.username) {
    this.username = this.email.split("@")[0] + Math.floor(Math.random() * 1000);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
