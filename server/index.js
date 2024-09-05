const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();

const { PORT, MONGODB_URI } = process.env;

// middleware
app.use(express.json());

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
