require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    // origin: "http://localhost:5173",
    origin: "https://blogsphereapp.onrender.com",
  })
);
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Database Connection failed", error));

// Use the routes
app.use("/", authRoutes);
app.use("/post", postRoutes);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
