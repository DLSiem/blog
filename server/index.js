const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();

const { PORT, MONGODB_URI } = process.env;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(cookieParser()); // parse cookies

// implement cors to allow cross-origin requests
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:3000`);
      app.get("/", (req, res) => {
        res.send("Hello World");
      });
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error.message);
  });

// routes

const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);
